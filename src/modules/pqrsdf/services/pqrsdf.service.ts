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

export type FormattedPqrsdf = {
    id: number;
    filingNumber: number;
    patientName: string | null;
    patientDocument: string | null;
    classification: string;
    status: string;
    pqrsDate: Date | null;
    originAreaName: string | null;
    presenterName: string | null;
    createdAt: Date;
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

    /**
     * Auto-generate the next sequential filing number.
     * Queries the current MAX(filing_number) and returns +1.
     * NOTE: Not transaction-safe under extreme concurrency but sufficient for current needs.
     */
    private async generateFilingNumber(): Promise<number> {
        const result = await this.getRepository()
            .createQueryBuilder("pqrsdf")
            .select("MAX(pqrsdf.filingNumber)", "max")
            .getRawOne();
        const currentMax = result?.max ? parseInt(result.max, 10) : 0;
        return currentMax + 1;
    }

    async create(data: CreatePqrsdfInput, userId: number): Promise<Pqrsdf> {
        const repo = this.getRepository();
        const filingNumber = await this.generateFilingNumber();

        const pqrsdf = repo.create({
            patientId: data.patientId,
            populationTypeId: data.populationTypeId,
            presentedBy: data.presentedBy,
            presenterName: data.presenterName,
            classification: data.classification,
            instance: data.instance,
            receptionMedium: data.receptionMedium,
            filingNumber,
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

    formatList(pqrsdfArray: Pqrsdf[]): FormattedPqrsdf[] {
        return pqrsdfArray.map((p) => ({
            id: p.id,
            filingNumber: p.filingNumber,
            patientName: p.patientRelation?.name ?? null,
            patientDocument: p.patientRelation?.documentNumber ?? null,
            classification: p.classification,
            status: p.status,
            pqrsDate: p.pqrsDate ?? null,
            originAreaName: p.originAreaRelation?.name ?? null,
            presenterName: p.presenterName ?? "Usuario Afectado",
            createdAt: p.createdAt,
        }));
    }
}
