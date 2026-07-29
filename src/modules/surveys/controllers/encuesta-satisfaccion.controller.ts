import { NextFunction, Request, Response } from "express";
import { EncuestaSatisfaccion } from "../entities/encuesta-satisfaccion";
import { validate } from "class-validator";
import { id } from "date-fns/locale/id";

async function findOneWithRelations(id: number): Promise<EncuestaSatisfaccion | null> {
    return EncuestaSatisfaccion.createQueryBuilder("survey")
        .leftJoinAndSelect("survey.patientRelation", "patient")
        .leftJoinAndSelect("survey.municipioRelation", "municipio")
        .leftJoinAndSelect("survey.specialPopulationRelation", "specialPopulation")
        .leftJoinAndSelect("survey.attentionServiceRelation", "attentionService")
        .leftJoinAndSelect("survey.userRelation", "user")
        .where("survey.id = :id", { id })
        .getOne();
}

export async function createSurvey(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;

        const {
            patientId,
            municipalityId,
            specialPopulationId,
            attentionServiceId,
            timelyAppointment,
            punctualCare,
            professionalInterest,
            clearRecommendations,
            signageHelped,
            adequateFacilities,
            cleanFacilities,
            professionalCareRating,
            customerServiceRating,
            globalExperience,
            wouldRecommend
        } = req.body;

        const survey = new EncuestaSatisfaccion();

        survey.patientId = parseInt(String(patientId));
        survey.municipalityId = parseInt(String(municipalityId));
        survey.specialPopulationId = parseInt(String(specialPopulationId));
        survey.attentionServiceId = parseInt(String(attentionServiceId));
        survey.timelyAppointment = timelyAppointment;
        survey.punctualCare = punctualCare;
        survey.professionalInterest = professionalInterest;
        survey.clearRecommendations = clearRecommendations;
        survey.signageHelped = signageHelped;
        survey.adequateFacilities = adequateFacilities;
        survey.cleanFacilities = cleanFacilities;
        survey.professionalCareRating = professionalCareRating;
        survey.customerServiceRating = customerServiceRating;
        survey.globalExperience = globalExperience;
        survey.wouldRecommend = wouldRecommend;
        survey.createdBy = userId;

        const errors = await validate(survey);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res.status(400).json({ message: "Error de validación", messages });
        }

        await survey.save();

        const saved = await findOneWithRelations(survey.id);

        return res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
}

export async function getAllSurveys(req: Request, res: Response, next: NextFunction) {
    try {

        const qb = await EncuestaSatisfaccion.createQueryBuilder("survey")
            .leftJoinAndSelect("survey.patientRelation", "patient")
            .leftJoinAndSelect("survey.municipioRelation", "municipio")
            .leftJoinAndSelect("survey.specialPopulationRelation", "specialPopulation")
            .leftJoinAndSelect("survey.attentionServiceRelation", "attentionService")
            .leftJoinAndSelect("survey.userRelation", "user")
            .orderBy("survey.createdAt", "DESC")
            .getMany();

        const surveyFormat = qb.map((s) => ({
            id: s.id,
            patientName: s.patientRelation?.name,
            patientDocument: s.patientRelation?.documentNumber,
            municipality: s.municipioRelation?.name,
            attentionService: s.attentionServiceRelation?.name,
            specialPopulation: s.specialPopulationRelation?.name,
            globalExperience: s.globalExperience,
            wouldRecommend: s.wouldRecommend,
            createdAt: s.createdAt,
            registeredBy: s.userRelation
                ? `${s.userRelation.name} ${s.userRelation.lastName}`
                : null,
        }));


        return res.json(surveyFormat);
    } catch (error) {
        next(error);
    }
}

export async function getSurvey(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const survey = await findOneWithRelations(parseInt(String(id)));

        if (!survey) {
            return res.status(404).json({ message: "Encuesta de satisfacción no encontrada" });
        }

        return res.json(survey);
    } catch (error) {
        next(error);
    }
}

export async function updateSurvey(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const survey = await EncuestaSatisfaccion.findOneBy({ id: parseInt(String(id)) });

        if (!survey) {
            return res.status(404).json({ message: "Encuesta de satisfacción no encontrada" });
        }

        survey.patientId = parseInt(String(req.body.patientId));
        survey.municipalityId = parseInt(String(req.body.municipalityId));
        survey.specialPopulationId = parseInt(String(req.body.specialPopulationId));
        survey.attentionServiceId = parseInt(String(req.body.attentionServiceId));
        survey.timelyAppointment = req.body.timelyAppointment;
        survey.punctualCare = req.body.punctualCare;
        survey.professionalInterest = req.body.professionalInterest;
        survey.clearRecommendations = req.body.clearRecommendations;
        survey.signageHelped = req.body.signageHelped;
        survey.adequateFacilities = req.body.adequateFacilities;
        survey.cleanFacilities = req.body.cleanFacilities;
        survey.professionalCareRating = req.body.professionalCareRating;
        survey.customerServiceRating = req.body.customerServiceRating;
        survey.globalExperience = req.body.globalExperience;
        survey.wouldRecommend = req.body.wouldRecommend;

        const errors = await validate(survey);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res.status(400).json({ message: "Error de validación", messages });
        }

        await survey.save();

        const updated = await findOneWithRelations(parseInt(String(id)));

        return res.json(updated);
    } catch (error) {
        next(error);
    }
}

export async function deleteSurvey(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await EncuestaSatisfaccion.delete(parseInt(String(id)));

        if (!result.affected) {
            return res.status(404).json({ message: "Encuesta de satisfacción no encontrada" });
        }

        return res.json({ message: "Encuesta de satisfacción eliminada" });
    } catch (error) {
        next(error);
    }
}
