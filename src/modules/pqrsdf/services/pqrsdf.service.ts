import { DataSource } from "typeorm";
import { AppDataSource } from "@core/db/conexion";
import { Pqrsdf, EstadoPqrs, PresentadoPor, ClasificacionPqrs, Instancia, MedioRecepcion, MedioNotificacion, AtributoAfectado } from "../entities/pqrsdf";
import { PqrsdfRiskPolicy } from "../../catalog/entities/pqrsdf-risk-policy";
import { PqrsdfStatusHistory } from "../entities/pqrsdf-status-history";

export type CreatePqrsdfInput = {
    patientId: number;
    populationTypeId: number;
    presentedBy: string;
    presenterName?: string;
    classification: string;
    instance: string;
    receptionMedium: string;
    originAreaId: number;
    generalReasonId: number;
    specificReasonId?: number;
    generationAreaId: number;
    description: string;
    pqrsDate: Date;
    receivedDate: Date;
    resolutionAreaId?: number;
    responseDate?: Date;
    notificationMedium?: string;
    affectedAttribute?: string;
    improvementAction?: boolean;
    improvementActionDetails?: string;
    responseSummary?: string;
    filingNumber: number;
    riskCode: string;
    status?: string;
};

export type UpdatePqrsdfInput = Omit<CreatePqrsdfInput, "riskCode">;

export type PqrsdfFilters = {
    startDate?: string;
    endDate?: string;
    status?: string;
    classification?: string;
    instance?: string;
    patientDocument?: string;
    originAreaId?: string;
};

export class PqrsdfService {
    constructor(private readonly ds: DataSource = AppDataSource) { }

    static computeSlaDeadlineFromSnapshot(
        durationValue: number,
        durationUnit: "HOURS" | "DAYS",
        createdAt: Date,
    ): Date {
        const hours = durationUnit === "DAYS" ? durationValue * 24 : durationValue;
        return new Date(createdAt.getTime() + hours * 60 * 60 * 1000);
    }

    static computeSlaDeadline(policy: PqrsdfRiskPolicy, createdAt: Date): Date {
        return PqrsdfService.computeSlaDeadlineFromSnapshot(
            policy.slaDurationValue,
            policy.slaDurationUnit,
            createdAt,
        );
    }

    static computeSlaOverdue(slaDeadlineAt: Date, referenceDate: Date): boolean {
        return referenceDate > slaDeadlineAt;
    }

    static computeSlaOverdueSeconds(slaDeadlineAt: Date, referenceDate: Date): number {
        return Math.max(0, Math.floor((referenceDate.getTime() - slaDeadlineAt.getTime()) / 1000));
    }
    static validateTransitionNote(statusChanged: boolean, note: string | null | undefined): string | null {
        if (!statusChanged) return null;

        const hasNote = note != null && note.trim().length > 0;
        if (!hasNote) {
            return "La nota es obligatoria al cambiar el estado de la PQRSDF";
        }

        return null;
    }

    private getRepository() {
        return this.ds.getRepository(Pqrsdf);
    }

    private buildFindOneQuery(id: number) {
        return this.getRepository()
            .createQueryBuilder("pqrsdf")
            .leftJoinAndSelect("pqrsdf.patientRelation", "patient")
            .leftJoinAndSelect("patient.documentRelation", "document")
            .leftJoinAndSelect("patient.convenioRelation", "agreement")
            .leftJoinAndSelect("pqrsdf.populationTypeRelation", "populationType")
            .leftJoinAndSelect("pqrsdf.originAreaRelation", "originArea")
            .leftJoinAndSelect("pqrsdf.generalReasonRelation", "generalReason")
            .leftJoinAndSelect("pqrsdf.specificReasonRelation", "specificReason")
            .leftJoinAndSelect("pqrsdf.generationAreaRelation", "generationArea")
            .leftJoinAndSelect("pqrsdf.resolutionAreaRelation", "resolutionArea")
            .leftJoinAndSelect("pqrsdf.userRelation", "user")
            .leftJoinAndSelect("pqrsdf.riskRelation", "risk")
            .where("pqrsdf.id = :id", { id });
    }

    private buildFindAllQuery() {
        return this.getRepository()
            .createQueryBuilder("pqrsdf")
            .leftJoinAndSelect("pqrsdf.patientRelation", "patient")
            .leftJoinAndSelect("patient.documentRelation", "type_document")
            .leftJoinAndSelect("patient.convenioRelation", "agreement")
            .leftJoinAndSelect("pqrsdf.populationTypeRelation", "populationType")
            .leftJoinAndSelect("pqrsdf.originAreaRelation", "originArea")
            .leftJoinAndSelect("pqrsdf.generalReasonRelation", "generalReason")
            .leftJoinAndSelect("pqrsdf.specificReasonRelation", "specificReason")
            .leftJoinAndSelect("pqrsdf.generationAreaRelation", "generationArea")
            .leftJoinAndSelect("pqrsdf.resolutionAreaRelation", "resolutionArea")
            .leftJoinAndSelect("pqrsdf.userRelation", "user")
            .leftJoinAndSelect("pqrsdf.riskRelation", "risk")
            .orderBy("pqrsdf.createdAt", "DESC");
    }

    private async refreshOverdue(entity: Pqrsdf): Promise<void> {
        if (!entity.slaDeadlineAt) return;

        const isAlreadyOverdue = entity.slaOverdue;
        const isClosed = entity.status === EstadoPqrs.CERRADO;

        if (isClosed && isAlreadyOverdue) return;

        const now = new Date();
        const isNowOverdue = PqrsdfService.computeSlaOverdue(entity.slaDeadlineAt, now);

        if (!isNowOverdue && !isAlreadyOverdue) return;

        if (isNowOverdue) {
            const seconds = PqrsdfService.computeSlaOverdueSeconds(entity.slaDeadlineAt, now);
            if (!isAlreadyOverdue || seconds > (entity.slaOverdueSeconds ?? 0)) {
                entity.slaOverdue = true;
                entity.slaOverdueSeconds = seconds;
                if (!isClosed) {
                    await this.getRepository().save(entity);
                }
            }
        }
    }

    async create(data: CreatePqrsdfInput, userId: number): Promise<Pqrsdf> {
        const riskCode = data.riskCode;

        const policy = await this.ds.getRepository(PqrsdfRiskPolicy).findOneBy({ code: riskCode, active: true });

        if (!policy) {
            if (await this.ds.getRepository(PqrsdfRiskPolicy).findOneBy({ code: riskCode })) {
                throw new Error(`La política de riesgo "${riskCode}" está inactiva`);
            }
            throw new Error(`Código de riesgo "${riskCode}" no es válido. Use uno de: VITAL, PRIORIZADO, SIMPLE, GENERAL`);
        }

        const savedId = await this.ds.transaction(async (manager) => {
            const repo = manager.getRepository(Pqrsdf);

            const pqrsdf = repo.create({
                patientId: data.patientId,
                populationTypeId: data.populationTypeId,
                presentedBy: data.presentedBy,
                presenterName: data.presenterName,
                classification: data.classification,
                instance: data.instance,
                receptionMedium: data.receptionMedium,
                filingNumber: data.filingNumber,
                originAreaId: data.originAreaId,
                generalReasonId: data.generalReasonId,
                specificReasonId: data.specificReasonId,
                generationAreaId: data.generationAreaId,
                description: data.description,
                pqrsDate: data.pqrsDate,
                receivedDate: data.receivedDate,
                resolutionAreaId: data.resolutionAreaId,
                responseDate: data.responseDate ? data.responseDate : undefined,
                notificationMedium: data.notificationMedium,
                affectedAttribute: data.affectedAttribute,
                improvementAction: data.improvementAction,
                improvementActionDetails: data.improvementActionDetails,
                riskId: policy.id,
                status: EstadoPqrs.ABIERTO,
                slaDurationValue: policy.slaDurationValue,
                slaDurationUnit: policy.slaDurationUnit,
                slaBusinessDays: policy.businessDays,
                createdBy: userId,
            } as Pqrsdf);

            const saved = await repo.save(pqrsdf);
            saved.slaDeadlineAt = PqrsdfService.computeSlaDeadline(policy, saved.createdAt);
            await repo.save(saved);

            const historyRepo = manager.getRepository(PqrsdfStatusHistory);
            await historyRepo.save(
                historyRepo.create({
                    pqrsdfId: saved.id,
                    status: EstadoPqrs.ABIERTO,
                    note: data.responseSummary ?? null,
                    actorId: userId,
                } as PqrsdfStatusHistory),
            );

            return saved.id;
        });

        const result = await this.buildFindOneQuery(savedId).getOne();
        if (!result) {
            throw new Error("PQRSDF no encontrada después de crearla");
        }
        return result;
    }

    async findAll(filters?: PqrsdfFilters): Promise<Pqrsdf[]> {
        let qb = this.buildFindAllQuery();

        if (filters) {
            if (filters.startDate && filters.endDate) {
                qb = qb.andWhere("pqrsdf.pqrsDate BETWEEN :startDate AND :endDate", {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
            } else if (filters.startDate) {
                qb = qb.andWhere("pqrsdf.pqrsDate >= :startDate", { startDate: filters.startDate });
            } else if (filters.endDate) {
                qb = qb.andWhere("pqrsdf.pqrsDate <= :endDate", { endDate: filters.endDate });
            }

            if (filters.status) {
                qb = qb.andWhere("pqrsdf.status = :status", { status: filters.status });
            }

            if (filters.classification) {
                qb = qb.andWhere("pqrsdf.classification = :classification", { classification: filters.classification });
            }

            if (filters.instance) {
                qb = qb.andWhere("pqrsdf.instance = :instance", { instance: filters.instance });
            }

            if (filters.patientDocument) {
                qb = qb.andWhere("patient.documentNumber = :patientDocument", { patientDocument: filters.patientDocument });
            }

            if (filters.originAreaId) {
                qb = qb.andWhere("pqrsdf.originAreaId = :originAreaId", { originAreaId: parseInt(filters.originAreaId, 10) });
            }
        }

        return qb.getMany();
    }

    async findOne(id: number): Promise<Pqrsdf | null> {
        const entity = await this.buildFindOneQuery(id).getOne();
        if (entity) {
            entity.statusHistoryRelation = await this.ds.getRepository(PqrsdfStatusHistory).find({
                where: { pqrsdfId: id },
                relations: { actorRelation: true },
                order: { id: "ASC" },
            });
            await this.refreshOverdue(entity);
        }
        return entity;
    }

    async update(id: number, data: UpdatePqrsdfInput, userId: number): Promise<Pqrsdf> {
        await this.ds.transaction(async (manager) => {
            const repo = manager.getRepository(Pqrsdf);
            const existing = await repo.findOneBy({ id });

            if (!existing) {
                throw new Error("PQRSDF no encontrada");
            }

            existing.patientId = data.patientId;
            existing.populationTypeId = data.populationTypeId;
            existing.presentedBy = data.presentedBy as PresentadoPor;
            existing.presenterName = data.presenterName;
            existing.classification = data.classification as ClasificacionPqrs;
            existing.instance = data.instance as Instancia;
            existing.receptionMedium = data.receptionMedium as MedioRecepcion;
            existing.originAreaId = data.originAreaId;
            existing.generalReasonId = data.generalReasonId;
            existing.specificReasonId = data.specificReasonId;
            existing.generationAreaId = data.generationAreaId;
            existing.description = data.description;
            existing.pqrsDate = new Date(data.pqrsDate);
            existing.receivedDate = new Date(data.receivedDate);
            existing.resolutionAreaId = data.resolutionAreaId;
            existing.responseDate = data.responseDate ? new Date(data.responseDate) : undefined;
            existing.notificationMedium = data.notificationMedium as MedioNotificacion;
            existing.affectedAttribute = data.affectedAttribute as AtributoAfectado;
            existing.improvementAction = data.improvementAction;
            existing.improvementActionDetails = data.improvementActionDetails;

            const newStatus = data.status as EstadoPqrs;
            const statusChanged = existing.status !== newStatus;

            const noteError = PqrsdfService.validateTransitionNote(statusChanged, data.responseSummary);
            if (noteError) {
                throw new Error(noteError);
            }

            const wasAlreadyClosed = existing.status === EstadoPqrs.CERRADO;
            existing.status = newStatus;

            if (newStatus === EstadoPqrs.CERRADO && !wasAlreadyClosed) {
                existing.slaClosedAt = new Date();
                if (existing.slaDeadlineAt) {
                    const now = new Date();
                    const isOverdue = PqrsdfService.computeSlaOverdue(existing.slaDeadlineAt, now);
                    existing.slaOverdue = isOverdue;
                    if (isOverdue) {
                        existing.slaOverdueSeconds = PqrsdfService.computeSlaOverdueSeconds(existing.slaDeadlineAt, now);
                    }
                }
            }

            await repo.save(existing);

                const historyRepo = manager.getRepository(PqrsdfStatusHistory);
                await historyRepo.save(
                    historyRepo.create({
                        pqrsdfId: existing.id,
                        status: newStatus,
                        note: data.responseSummary ?? null,
                        actorId: userId,
                    } as PqrsdfStatusHistory),
                );
        });

        const updated = await this.buildFindOneQuery(id).getOne();
        if (!updated) {
            throw new Error("PQRSDF no encontrada después de actualizarla");
        }

        await this.refreshOverdue(updated);
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.getRepository().delete(id);
        return !!result.affected && result.affected > 0;
    }

    formatList(pqrsdfArray: Pqrsdf[] | Pqrsdf) {

        if (Array.isArray(pqrsdfArray)) {
            return pqrsdfArray.map((p) => ({
                id: p.id,
                filingNumber: p.filingNumber,
                patientId: p.patientId,
                patientName: p.patientRelation?.name,
                patientDocument: p.patientRelation?.documentNumber,
                patientPhone: p.patientRelation?.phoneNumber,
                patientEmail: p.patientRelation?.email,
                patientTypeDocument: p.patientRelation?.documentRelation?.name,
                patientAgreement: p.patientRelation?.convenioRelation?.name,
                populationType: p.populationTypeRelation?.name,
                presentedBy: p.presentedBy,
                presenterName: p.presenterName,
                classification: p.classification,
                instance: p.instance,
                receptionMedium: p.receptionMedium,
                generalReason: p.generalReasonRelation?.name,
                specificReasonId: p.specificReasonId,
                specificReasonCode: p.specificReasonRelation?.code,
                specificReason: p.specificReasonRelation?.name,
                originAreaName: p.originAreaRelation?.name,
                description: p.description,
                receivedDate: p.receivedDate,
                resolutionAreaName: p.resolutionAreaRelation?.name,
                responseDate: p.responseDate,
                notificationMedium: p.notificationMedium,
                affectedAttribute: p.affectedAttribute,
                improvementAction: p.improvementAction,
                improvementActionDetails: p.improvementActionDetails,
                riskCode: p.riskRelation?.code,
                riskName: p.riskRelation?.name,
                status: p.status,
                slaDurationValue: p.slaDurationValue,
                slaDurationUnit: p.slaDurationUnit,
                slaBusinessDays: p.slaBusinessDays,
                slaDeadlineAt: p.slaDeadlineAt,
                slaClosedAt: p.slaClosedAt,
                slaOverdue: p.slaOverdue,
                slaOverdueSeconds: p.slaOverdueSeconds,
                pqrsDate: p.pqrsDate,
                createdBy: p.userRelation?.name,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }));
        } else {
            return {
                id: pqrsdfArray.id,
                patientId: pqrsdfArray.patientId,
                filingNumber: pqrsdfArray.filingNumber,
                patientName: pqrsdfArray.patientRelation?.name,
                patientDocument: pqrsdfArray.patientRelation?.documentNumber,
                patientPhone: pqrsdfArray.patientRelation?.phoneNumber,
                patientEmail: pqrsdfArray.patientRelation?.email,
                patientTypeDocument: pqrsdfArray.patientRelation?.documentRelation?.name,
                populationTypeId: pqrsdfArray.populationTypeId,
                populationType: pqrsdfArray.populationTypeRelation?.name,
                patientAgreement: pqrsdfArray.patientRelation?.convenioRelation?.name,
                presentedBy: pqrsdfArray.presentedBy,
                presenterName: pqrsdfArray.presenterName,
                classification: pqrsdfArray.classification,
                instance: pqrsdfArray.instance,
                receptionMedium: pqrsdfArray.receptionMedium,
                generalReasonId: pqrsdfArray.generalReasonId,
                generalReason: pqrsdfArray.generalReasonRelation?.name,
                specificReasonId: pqrsdfArray.specificReasonId,
                 specificReasonCode: pqrsdfArray.specificReasonRelation?.code,
                specificReason: pqrsdfArray.specificReasonRelation?.name,
                generationAreaId: pqrsdfArray.generationAreaId,
                generationAreaName: pqrsdfArray.generationAreaRelation?.name,
                originAreaId: pqrsdfArray.originAreaId,
                originAreaName: pqrsdfArray.originAreaRelation?.name,
                description: pqrsdfArray.description,
                receivedDate: pqrsdfArray.receivedDate,
                resolutionAreaId: pqrsdfArray.resolutionAreaId,
                resolutionAreaName: pqrsdfArray.resolutionAreaRelation?.name,
                responseDate: pqrsdfArray.responseDate,
                notificationMedium: pqrsdfArray.notificationMedium,
                affectedAttribute: pqrsdfArray.affectedAttribute,
                improvementAction: pqrsdfArray.improvementAction,
                improvementActionDetails: pqrsdfArray.improvementActionDetails,
                riskCode: pqrsdfArray.riskRelation?.code,
                riskName: pqrsdfArray.riskRelation?.name,
                status: pqrsdfArray.status,
                slaDurationValue: pqrsdfArray.slaDurationValue,
                slaDurationUnit: pqrsdfArray.slaDurationUnit,
                slaBusinessDays: pqrsdfArray.slaBusinessDays,
                slaDeadlineAt: pqrsdfArray.slaDeadlineAt,
                slaClosedAt: pqrsdfArray.slaClosedAt,
                slaOverdue: pqrsdfArray.slaOverdue,
                slaOverdueSeconds: pqrsdfArray.slaOverdueSeconds,
                pqrsDate: pqrsdfArray.pqrsDate,
                createdBy: pqrsdfArray.userRelation?.name,
                createdAt: pqrsdfArray.createdAt,
                updatedAt: pqrsdfArray.updatedAt,
                statusHistory: (pqrsdfArray.statusHistoryRelation ?? []).map((h) => ({
                    id: h.id,
                    status: h.status,
                    note: h.note,
                    actor: h.actorRelation?.name ?? null,
                    timestamp: h.createdAt,
                })),
            }
        }
    }
}
