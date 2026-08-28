import { NextFunction, Request, Response } from "express";
import { EstadoPqrs, Pqrsdf } from "../entities/pqrsdf";
import { validate } from "class-validator";
import { PqrsdfService } from "../services/pqrsdf.service";

const service = new PqrsdfService();

export async function createPqrsdf(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;

        const {
            patientId,
            populationTypeId,
            presentedBy,
            presenterName,
            classification,
            instance,
            receptionMedium,
            originAreaId,
            generalReasonId,
            specificReasonId,
            generationAreaId,
            description,    
            pqrsDate,
            receivedDate,
            filingNumber,
            responseSummary,
            improvementAction,
            improvementActionDetails,
             riskCode,
        } = req.body;

        const pqrsdf = new Pqrsdf();

        pqrsdf.patientId = parseInt(String(patientId));
        pqrsdf.populationTypeId = parseInt(String(populationTypeId));
        pqrsdf.presentedBy = presentedBy;
        pqrsdf.presenterName = presenterName;
        pqrsdf.classification = classification;
        pqrsdf.instance = instance;
        pqrsdf.receptionMedium = receptionMedium;
        pqrsdf.originAreaId = parseInt(String(originAreaId));
        pqrsdf.generalReasonId = parseInt(String(generalReasonId));
        pqrsdf.specificReasonId = specificReasonId != null ? parseInt(String(specificReasonId)) : undefined;
        pqrsdf.generationAreaId = parseInt(String(generationAreaId));
        pqrsdf.description = description;
        pqrsdf.pqrsDate = new Date(pqrsDate);
        pqrsdf.receivedDate = new Date(receivedDate);
        pqrsdf.createdBy = userId;
        pqrsdf.status = EstadoPqrs.ABIERTO;
        pqrsdf.filingNumber = Number(filingNumber)
        pqrsdf.riskId = 1;
        pqrsdf.improvementAction = improvementAction;
        pqrsdf.improvementActionDetails = improvementActionDetails;

        const errors = await validate(pqrsdf);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res.status(400).json({ message: "Error de validación", messages });
        }

        const created = await service.create({
            patientId: pqrsdf.patientId,
            populationTypeId: pqrsdf.populationTypeId,
            presentedBy: pqrsdf.presentedBy,
            presenterName: pqrsdf.presenterName,
            classification: pqrsdf.classification,
            instance: pqrsdf.instance,
            receptionMedium: pqrsdf.receptionMedium,
            originAreaId: pqrsdf.originAreaId,
            generalReasonId: pqrsdf.generalReasonId,
            specificReasonId: pqrsdf.specificReasonId,
            generationAreaId: pqrsdf.generationAreaId,
            description: pqrsdf.description,
            pqrsDate: pqrsdf.pqrsDate,
            receivedDate: pqrsdf.receivedDate,
            resolutionAreaId: pqrsdf.resolutionAreaId,
            responseDate: pqrsdf.responseDate,
            notificationMedium: pqrsdf.notificationMedium,
            affectedAttribute: pqrsdf.affectedAttribute,
            improvementAction: pqrsdf.improvementAction,
            improvementActionDetails: pqrsdf.improvementActionDetails,
            responseSummary,
            filingNumber: pqrsdf.filingNumber,
            riskCode,
        }, userId);

        return res.status(201).json(created);
    } catch (error) {
        next(error);
    }
}

export async function getAllPqrsdf(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate, status, classification, instance, patientDocument, originAreaId } = req.query;

        const filters = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            status: status as string | undefined,
            classification: classification as string | undefined,
            instance: instance as string | undefined,
            patientDocument: patientDocument as string | undefined,
            originAreaId: originAreaId as string | undefined,
        };

        const pqrsdfList = await service.findAll(filters);
        const formatted = service.formatList(pqrsdfList);

        return res.json(formatted);
    } catch (error) {
        next(error);
    }
}

export async function getPqrsdf(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const pqrsdf = await service.findOne(parseInt(String(id)));

        if (!pqrsdf) {
            return res.status(404).json({ message: "PQRSDF no encontrada" });
        }

        const formatted = service.formatList(pqrsdf);

        return res.json(formatted);
    } catch (error) {
        next(error);
    }
}

export async function updatePqrsdf(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const {
            patientId,
            populationTypeId,
            presentedBy,
            presenterName,
            classification,
            instance,
            receptionMedium,
            originAreaId,
            generalReasonId,
            specificReasonId,
            generationAreaId,
            description,
            pqrsDate,
            receivedDate,
            resolutionAreaId,
            responseDate,
            notificationMedium,
            affectedAttribute,
            improvementAction,
            improvementActionDetails,
            responseSummary,
            status,
        } = req.body;

        const existing = await service.findOne(parseInt(String(id)));

        if (!existing) {
            return res.status(404).json({ message: "PQRSDF no encontrada" });
        }

        const pqrsdf = new Pqrsdf();

        pqrsdf.patientId = patientId
        pqrsdf.populationTypeId = populationTypeId;
        pqrsdf.presentedBy = presentedBy
        pqrsdf.presenterName = presenterName
        pqrsdf.classification = classification
        pqrsdf.instance = instance
        pqrsdf.receptionMedium = receptionMedium
        pqrsdf.originAreaId = originAreaId
        pqrsdf.generalReasonId = generalReasonId
        pqrsdf.specificReasonId = specificReasonId != null ? parseInt(String(specificReasonId)) : undefined
        pqrsdf.generationAreaId = generationAreaId
        pqrsdf.description = description
        pqrsdf.pqrsDate = pqrsDate
        pqrsdf.receivedDate = receivedDate
        pqrsdf.resolutionAreaId = resolutionAreaId != null ? parseInt(String(resolutionAreaId)) : undefined;
        pqrsdf.responseDate = responseDate
        pqrsdf.notificationMedium = notificationMedium
        pqrsdf.affectedAttribute = affectedAttribute
        pqrsdf.improvementAction = Boolean(improvementAction);
        pqrsdf.improvementActionDetails = improvementActionDetails;
        pqrsdf.createdBy = existing.createdBy;
        pqrsdf.filingNumber = existing.filingNumber;
        pqrsdf.status = status;
        pqrsdf.riskId = existing.riskId;

        const errors = await validate(pqrsdf);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res.status(400).json({ message: "Error de validación", messages });
        }

        const updated = await service.update(parseInt(String(id)), {
            patientId: pqrsdf.patientId,
            populationTypeId: pqrsdf.populationTypeId,
            presentedBy: pqrsdf.presentedBy,
            presenterName: pqrsdf.presenterName,
            classification: pqrsdf.classification,
            instance: pqrsdf.instance,
            receptionMedium: pqrsdf.receptionMedium,
            originAreaId: pqrsdf.originAreaId,
            generalReasonId: pqrsdf.generalReasonId,
            specificReasonId: pqrsdf.specificReasonId,
            generationAreaId: pqrsdf.generationAreaId,
            description: pqrsdf.description,
            pqrsDate: pqrsdf.pqrsDate,
            receivedDate: pqrsdf.receivedDate,
            resolutionAreaId: pqrsdf.resolutionAreaId ? pqrsdf.resolutionAreaId : undefined,
            responseDate: pqrsdf.responseDate,
            notificationMedium: pqrsdf.notificationMedium ? pqrsdf.notificationMedium : undefined,
            affectedAttribute: pqrsdf.affectedAttribute ? pqrsdf.affectedAttribute : undefined,
            improvementAction: pqrsdf.improvementAction,
            improvementActionDetails: pqrsdf.improvementActionDetails,
            responseSummary,
            filingNumber: pqrsdf.filingNumber,
            status: pqrsdf.status,
            // risk is immutable after create. The existing risk_id is preserved.
        }, userId);

        return res.json(updated);
    } catch (error) {
        next(error);
    }
}

export async function deletePqrsdf(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const deleted = await service.delete(parseInt(String(id)));

        if (!deleted) {
            return res.status(404).json({ message: "PQRSDF no encontrada" });
        }

        return res.json({ message: "PQRSDF eliminada" });
    } catch (error) {
        next(error);
    }
}
