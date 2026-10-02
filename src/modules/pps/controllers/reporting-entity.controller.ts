import { NextFunction, Request, Response } from "express";
import { PpsReportingEntity } from "../entities/pps-reporting-entity";
import { validateEntity } from "@core/utils/validation-helper";
import { parseBooleanFlag } from "@core/utils/boolean-helper";

const EDITABLE_FIELDS = [
    "identificationType",
    "identificationNumber",
    "entityName",
    "programmingFilePrefix",
    "monitoringFilePrefix",
    "strictMode",
    "programmingDueMonth",
    "programmingDueDay",
    "programmingDueYear",
    "monitoringDueMonth",
    "monitoringDueDay",
    "monitoringDueYear",
] as const;

const NUMERIC_FIELDS = [
    "programmingDueMonth",
    "programmingDueDay",
    "monitoringDueMonth",
    "monitoringDueDay",
] as const;

async function getOrCreateReportingEntity(): Promise<PpsReportingEntity> {
    const [existing] = await PpsReportingEntity.find({ order: { id: "ASC" }, take: 1 });

    if (existing) return existing;

    const created = PpsReportingEntity.create({
        identificationNumber: "",
        entityName: "",
    });

    return created.save();
}

export async function getReportingEntity(req: Request, res: Response, next: NextFunction) {
    try {
        const entity = await getOrCreateReportingEntity();

        return res.json(entity);
    } catch (error) {
        next(error);
    }
}

export async function updateReportingEntity(req: Request, res: Response, next: NextFunction) {
    try {
        const entity = await getOrCreateReportingEntity();

        for (const field of EDITABLE_FIELDS) {
            let value = req.body[field];

            if (value === undefined) continue;

            if ((NUMERIC_FIELDS as readonly string[]).includes(field)) {
                value = Number(value);
            }

            if (field === "strictMode") {
                value = parseBooleanFlag(value);
            }

            (entity as any)[field] = value;
        }

        await validateEntity(entity);
        await entity.save();

        return res.json(entity);
    } catch (error) {
        next(error);
    }
}
