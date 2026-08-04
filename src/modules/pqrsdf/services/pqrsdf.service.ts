import { DataSource, Between, Like } from "typeorm";
import { AppDataSource } from "@core/db/conexion";
import { Pqrsdf, EstadoPqrs, PresentadoPor, ClasificacionPqrs, Instancia, MedioRecepcion, MedioNotificacion, AtributoAfectado } from "../entities/pqrsdf";
import Logger from "@core/utils/logger-wrapper";

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
    specificReason?: string;
    generationAreaId: number;
    description: string;
    pqrsDate: Date;
    receivedDate: Date;
    resolutionAreaId?: number;
    responseDate?: Date;
    responseSummary?: string;
    notificationMedium?: string;
    affectedAttribute?: string;
    improvementAction?: boolean;
    filingNumber: Number;
    status?: string;
};

export type UpdatePqrsdfInput = CreatePqrsdfInput;

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
    constructor(private readonly ds: DataSource = AppDataSource) {}

    private getRepository() {
        return this.ds.getRepository(Pqrsdf);
    }

    private buildFindOneQuery(id: number) {
        return this.getRepository()
            .createQueryBuilder("pqrsdf")
            .leftJoinAndSelect("pqrsdf.patientRelation", "patient")
            .leftJoinAndSelect("patient.convenioRelation", "agreement")
            .leftJoinAndSelect("pqrsdf.populationTypeRelation", "populationType")
            .leftJoinAndSelect("pqrsdf.originAreaRelation", "originArea")
            .leftJoinAndSelect("pqrsdf.generalReasonRelation", "generalReason")
            .leftJoinAndSelect("pqrsdf.generationAreaRelation", "generationArea")
            .leftJoinAndSelect("pqrsdf.resolutionAreaRelation", "resolutionArea")
            .leftJoinAndSelect("pqrsdf.userRelation", "user")
            .where("pqrsdf.id = :id", { id });
    }

    private buildFindAllQuery() {
        return this.getRepository()
            .createQueryBuilder("pqrsdf")
            .leftJoinAndSelect("pqrsdf.patientRelation", "patient")
            .leftJoinAndSelect("pqrsdf.populationTypeRelation", "populationType")
            .leftJoinAndSelect("pqrsdf.originAreaRelation", "originArea")
            .leftJoinAndSelect("pqrsdf.generalReasonRelation", "generalReason")
            .leftJoinAndSelect("pqrsdf.generationAreaRelation", "generationArea")
            .leftJoinAndSelect("pqrsdf.resolutionAreaRelation", "resolutionArea")
            .leftJoinAndSelect("pqrsdf.userRelation", "user")
            .orderBy("pqrsdf.createdAt", "DESC");
    }

    async create(data: CreatePqrsdfInput, userId: number): Promise<Pqrsdf> {
        const repo = this.getRepository();

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
            specificReason: data.specificReason,
            generationAreaId: data.generationAreaId,
            description: data.description,
            pqrsDate: data.pqrsDate,
            receivedDate: data.receivedDate,
            resolutionAreaId: data.resolutionAreaId,
            responseDate: data.responseDate ? data.responseDate : undefined,
            responseSummary: data.responseSummary,
            notificationMedium: data.notificationMedium,
            affectedAttribute: data.affectedAttribute,
            improvementAction: data.improvementAction,
            // status: EstadoPqrs.ABIERTO,
            createdBy: userId,
        } as Pqrsdf);

        await repo.save(pqrsdf);
        const saved = await this.buildFindOneQuery(pqrsdf.id).getOne();
        if (!saved) {
            throw new Error("PQRSDF no encontrada después de crearla");
        }
        return saved;
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
        return this.buildFindOneQuery(id).getOne();
    }

    async update(id: number, data: UpdatePqrsdfInput): Promise<Pqrsdf> {
        const repo = this.getRepository();
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
        existing.specificReason = data.specificReason;
        existing.generationAreaId = data.generationAreaId;
        existing.description = data.description;
        existing.pqrsDate = new Date(data.pqrsDate);
        existing.receivedDate = new Date(data.receivedDate);
        existing.resolutionAreaId = data.resolutionAreaId;
        existing.responseDate = data.responseDate ? new Date(data.responseDate) : undefined;
        existing.responseSummary = data.responseSummary;
        existing.notificationMedium = data.notificationMedium as MedioNotificacion;
        existing.affectedAttribute = data.affectedAttribute as AtributoAfectado;
        existing.improvementAction = data.improvementAction;
        existing.status = data.status as EstadoPqrs;

        await repo.save(existing);

        const updated = await this.buildFindOneQuery(id).getOne();
        if (!updated) {
            throw new Error("PQRSDF no encontrada después de actualizarla");
        }
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
            patientPhone: p.patientRelation.phoneNumber,
            patientEmail: p.patientRelation.email,
            populationType: p.populationTypeRelation?.name,
            patientAgreement: p.patientRelation?.convenioRelation?.name,
            presentedBy: p.presentedBy,
            presenterName: p.presenterName,
            classification: p.classification,
            instance: p.instance,
            receptionMedium: p.receptionMedium,
            generalReason: p.generalReasonRelation?.name,
            specificReason: p.specificReason,
            originAreaName: p.originAreaRelation?.name,
            description: p.description,
            receivedDate: p.receivedDate,
            resolutionAreaName: p.resolutionAreaRelation?.name,
            responseDate: p.responseDate,
            responseSummary: p.responseSummary,
            notificationMedium: p.notificationMedium,
            affectedAttribute: p.affectedAttribute,
            improvementAction: p.improvementAction,
            status: p.status,
            pqrsDate: p.pqrsDate,
            createdBy: p.userRelation?.name,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }else {
        return {
            id: pqrsdfArray.id,
            patientId: pqrsdfArray.patientId,
            filingNumber: pqrsdfArray.filingNumber,
            patientName: pqrsdfArray.patientRelation?.name,
            patientDocument: pqrsdfArray.patientRelation?.documentNumber,
            patientPhone: pqrsdfArray.patientRelation.phoneNumber,
            patientEmail: pqrsdfArray.patientRelation.email,
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
            specificReason: pqrsdfArray.specificReason,
            generationAreaId: pqrsdfArray.generationAreaId,
            generationAreaName: pqrsdfArray.generationAreaRelation?.name,
            originAreaId: pqrsdfArray.originAreaId,
            originAreaName: pqrsdfArray.originAreaRelation?.name,
            description: pqrsdfArray.description,
            receivedDate: pqrsdfArray.receivedDate,
            resolutionAreaId: pqrsdfArray.resolutionAreaId,
            resolutionAreaName: pqrsdfArray.resolutionAreaRelation?.name,
            responseDate: pqrsdfArray.responseDate,
            responseSummary: pqrsdfArray.responseSummary,
            notificationMedium: pqrsdfArray.notificationMedium,
            affectedAttribute: pqrsdfArray.affectedAttribute,
            improvementAction: pqrsdfArray.improvementAction,
            status: pqrsdfArray.status,
            pqrsDate: pqrsdfArray.pqrsDate,
            createdBy: pqrsdfArray.userRelation?.name,
            createdAt: pqrsdfArray.createdAt,
            updatedAt: pqrsdfArray.updatedAt,
        }
    }
    }
}
