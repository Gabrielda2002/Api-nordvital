import { NextFunction, Request, Response } from "express";
import { PpsMonitoring } from "../entities/pps-monitoring";
import { PpsProgrammedActivity } from "../entities/pps-programmed-activity";
import { NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

export async function upsertMonitoring(req: Request, res: Response, next: NextFunction) {
    try {
        const programmedActivityId = Number(req.params.id);
        const activity = await PpsProgrammedActivity.findOneBy({ id: programmedActivityId });

        if (!activity) {
            throw new NotFoundError("No se encontró la actividad programada");
        }

        let monitoring = await PpsMonitoring.findOneBy({ programmedActivityId });

        if (!monitoring) {
            monitoring = PpsMonitoring.create({ programmedActivityId });
        }

        const { result, intervenedPopulationId, totalPersons, executedResources, fundingSourceId, evidenceLink, verificationMeans } = req.body;

        if (result !== undefined) {
            monitoring.result = result === null || result === "" ? null : Number(result);
        }

        if (intervenedPopulationId !== undefined) {
            monitoring.intervenedPopulationId =
                intervenedPopulationId === null || intervenedPopulationId === "" ? null : Number(intervenedPopulationId);
        }

        if (totalPersons !== undefined) {
            monitoring.totalPersons = totalPersons === null || totalPersons === "" ? null : Number(totalPersons);
        }

        if (executedResources !== undefined) {
            monitoring.executedResources = executedResources === null || executedResources === "" ? null : Number(executedResources);
        }

        if (fundingSourceId !== undefined) {
            monitoring.fundingSourceId =
                fundingSourceId === null || fundingSourceId === "" ? null : Number(fundingSourceId);
        }

        if (evidenceLink !== undefined) {
            const link = String(evidenceLink ?? "").trim();
            monitoring.evidenceLink = link === "" ? null : link;
        }

        if (verificationMeans !== undefined) {
            const means = String(verificationMeans ?? "").trim();
            monitoring.verificationMeans = means === "" ? null : means;
        }

        monitoring.updatedBy = req.user?.id;

        await validateEntity(monitoring);
        await monitoring.save();

        return res.json(monitoring);
    } catch (error) {
        next(error);
    }
}