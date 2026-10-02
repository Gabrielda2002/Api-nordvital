import { NextFunction, Request, Response } from "express";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { AppDataSource } from "@core/db/conexion";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { parseBooleanFlag } from "@core/utils/boolean-helper";

interface ParentCatalogConfig {
    field: string;
    entity: EntityTarget<any>;
    singularLabel: string;
}

interface CatalogConfig {
    entity: EntityTarget<any>;
    singularLabel: string;
    pluralLabel: string;
    parent?: ParentCatalogConfig;
    relations?: Record<string, any>;
    order?: Record<string, "ASC" | "DESC">;
    derive?: (instance: any) => void;
}

const normalizeCode = (value: unknown): string => String(value ?? "").trim().toUpperCase();

export function buildCatalogHandlers(config: CatalogConfig) {
    const repository = AppDataSource.getRepository(config.entity as EntityTarget<ObjectLiteral>);

    const findOrFail = async (id: number) => {
        const instance = await repository.findOneBy({ id } as any);

        if (!instance) {
            throw new NotFoundError(`No se encontró ${config.singularLabel}`);
        }

        return instance;
    };

    const assertParentExists = async (parentId: number) => {
        if (!config.parent) return;

        const parentRepository = AppDataSource.getRepository(config.parent.entity as EntityTarget<ObjectLiteral>);
        const parent = await parentRepository.findOneBy({ id: parentId } as any);

        if (!parent) {
            throw new BadRequestError(`No se encontró ${config.parent.singularLabel}`);
        }
    };

    const assertUniqueCode = async (code: string, parentId?: number, excludeId?: number) => {
        const where: Record<string, any> = { code };

        if (config.parent && parentId !== undefined) {
            where[config.parent.field] = parentId;
        }

        const existing = await repository.findOneBy(where as any);

        if (existing && existing.id !== excludeId) {
            const suffix = config.parent ? ` en ${config.parent.singularLabel}` : "";
            throw new ConflictError(`Ya existe ${config.singularLabel} con el código ${code}${suffix}`);
        }
    };

    const list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const where: Record<string, any> = {};

            if (parseBooleanFlag(req.query.onlyActive)) {
                where.status = true;
            }

            if (config.parent) {
                const rawParentId = req.query[config.parent.field];

                if (rawParentId !== undefined && rawParentId !== "") {
                    const parentId = Number(rawParentId);

                    if (Number.isNaN(parentId)) {
                        throw new BadRequestError(`El identificador de ${config.parent.singularLabel} es inválido`);
                    }

                    where[config.parent.field] = parentId;
                }
            }

            const rows = await repository.find({
                where: where as any,
                relations: config.relations,
                order: config.order,
            });

            return res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    const create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const instance: any = repository.create();
            instance.code = normalizeCode(req.body.code);
            instance.description = String(req.body.description ?? "").trim();
            instance.status = true;

            if (config.parent) {
                const rawParentId = req.body[config.parent.field];
                const parentId = Number(rawParentId);

                if (rawParentId === undefined || rawParentId === null || rawParentId === "" || Number.isNaN(parentId)) {
                    throw new BadRequestError(`El identificador de ${config.parent.singularLabel} es requerido`);
                }

                await assertParentExists(parentId);
                await assertUniqueCode(instance.code, parentId);
                instance[config.parent.field] = parentId;
            } else {
                await assertUniqueCode(instance.code);
            }

            if (config.derive) {
                config.derive(instance);
            }

            await validateEntity(instance);

            const saved = await repository.save(instance);

            return res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    };

    const update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const instance: any = await findOrFail(id);

            let parentId: number | undefined;

            if (config.parent) {
                if (req.body[config.parent.field] !== undefined) {
                    parentId = Number(req.body[config.parent.field]);

                    if (Number.isNaN(parentId)) {
                        throw new BadRequestError(`El identificador de ${config.parent.singularLabel} es inválido`);
                    }

                    await assertParentExists(parentId);
                    instance[config.parent.field] = parentId;
                } else {
                    parentId = instance[config.parent.field];
                }
            }

            if (req.body.code !== undefined) {
                instance.code = normalizeCode(req.body.code);
                await assertUniqueCode(instance.code, parentId, id);
            }

            if (req.body.description !== undefined) {
                instance.description = String(req.body.description ?? "").trim();
            }

            if (req.body.status !== undefined) {
                instance.status = parseBooleanFlag(req.body.status);
            }

            if (config.derive) {
                config.derive(instance);
            }

            await validateEntity(instance);

            const saved = await repository.save(instance);

            return res.json(saved);
        } catch (error) {
            next(error);
        }
    };

    const disable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const instance: any = await findOrFail(id);

            instance.status = false;
            await repository.save(instance);

            return res.json({ message: "Registro desactivado correctamente" });
        } catch (error) {
            next(error);
        }
    };

    return { list, create, update, disable };
}
