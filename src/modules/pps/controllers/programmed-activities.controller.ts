import { NextFunction, Request, Response } from "express";
import { PpsPeriod } from "../entities/pps-period";
import { PpsProgrammedActivity } from "../entities/pps-programmed-activity";
import { NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { buildProgrammedActivityData } from "../services/programmed-activities.service";
import { validateMonitoringCompleteness } from "../services/monitoring.service";

export async function getProgrammedActivities(req: Request, res: Response, next: NextFunction) {
    try {
        const periodId = Number(req.params.id);
        const period = await PpsPeriod.findOneBy({ id: periodId });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        const activities = await PpsProgrammedActivity.find({
            where: { periodId },
            relations: { headquartersRelation: true, monitoringRelation: true },
            order: { id: "ASC" },
        });

        const rows = activities.map((activity) => {
            const monitoringIssues = validateMonitoringCompleteness(activity, activity.monitoringRelation ?? null);

            return {
                ...activity,
                monitoringComplete: monitoringIssues.length === 0,
                monitoringIssues,
            };
        });

        return res.json(rows);
    } catch (error) {
        next(error);
    }
}

export async function createProgrammedActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const periodId = Number(req.params.id);
        const period = await PpsPeriod.findOneBy({ id: periodId });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        const data = await buildProgrammedActivityData(req.body, period);
        const activity = PpsProgrammedActivity.create({ ...data, createdBy: req.user?.id });

        await validateEntity(activity);
        await activity.save();

        return res.status(201).json(activity);
    } catch (error) {
        next(error);
    }
}

export async function updateProgrammedActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const activity = await PpsProgrammedActivity.findOneBy({ id });

        if (!activity) {
            throw new NotFoundError("No se encontró la actividad programada");
        }

        const period = await PpsPeriod.findOneBy({ id: activity.periodId });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        const data = await buildProgrammedActivityData(req.body, period);

        Object.assign(activity, data);

        await validateEntity(activity);
        await activity.save();

        return res.json(activity);
    } catch (error) {
        next(error);
    }
}

export async function deleteProgrammedActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const activity = await PpsProgrammedActivity.findOneBy({ id });

        if (!activity) {
            throw new NotFoundError("No se encontró la actividad programada");
        }

        await activity.remove();

        return res.json({ message: "Actividad programada eliminada junto con su seguimiento" });
    } catch (error) {
        next(error);
    }
}
