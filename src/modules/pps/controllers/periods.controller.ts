import { NextFunction, Request, Response } from "express";
import { PpsPeriod } from "../entities/pps-period";
import { BadRequestError, ConflictError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";
import { parseBooleanFlag } from "@core/utils/boolean-helper";
import { parsePpsDate } from "../utils/pps-date.util";

const assertDateRange = (startDate: Date, endDate: Date, cutoffDate: Date | null): void => {
    if (String(endDate) < String(startDate)) {
        throw new BadRequestError("La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    if (cutoffDate && (String(cutoffDate) < String(startDate) || String(cutoffDate) > String(endDate))) {
        throw new BadRequestError("La fecha de corte debe estar dentro de la vigencia");
    }
};

const baseQuery = () =>
    PpsPeriod.createQueryBuilder("period").loadRelationCountAndMap(
        "period.activitiesCount",
        "period.programmedActivitiesRelation"
    );

export async function getPeriods(req: Request, res: Response, next: NextFunction) {
    try {
        const periods = await baseQuery().orderBy("period.validityYear", "DESC").getMany();

        return res.json(periods);
    } catch (error) {
        next(error);
    }
}

export async function getPeriod(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        const period = await baseQuery().where("period.id = :id", { id }).getOne();

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        return res.json(period);
    } catch (error) {
        next(error);
    }
}

export async function createPeriod(req: Request, res: Response, next: NextFunction) {
    try {
        const validityYear = Number(req.body.validityYear);

        if (!Number.isInteger(validityYear)) {
            throw new BadRequestError("El año de la vigencia es inválido");
        }

        const existing = await PpsPeriod.findOneBy({ validityYear });

        if (existing) {
            throw new ConflictError(`Ya existe una vigencia para el año ${validityYear}`);
        }

        const startDate = parsePpsDate(req.body.startDate, "fecha de inicio");
        const endDate = parsePpsDate(req.body.endDate, "fecha de fin");
        const cutoffDate = req.body.cutoffDate
            ? parsePpsDate(req.body.cutoffDate, "fecha de corte")
            : endDate;

        assertDateRange(startDate, endDate, cutoffDate);

        const period = PpsPeriod.create({
            validityYear,
            startDate,
            endDate,
            cutoffDate,
            status: true,
            createdBy: req.user?.id,
        });

        await validateEntity(period);
        await period.save();

        return res.status(201).json(period);
    } catch (error) {
        next(error);
    }
}

export async function updatePeriod(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const period = await PpsPeriod.findOneBy({ id });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        if (req.body.startDate !== undefined) {
            period.startDate = parsePpsDate(req.body.startDate, "fecha de inicio");
        }

        if (req.body.endDate !== undefined) {
            period.endDate = parsePpsDate(req.body.endDate, "fecha de fin");
        }

        if (req.body.cutoffDate !== undefined) {
            period.cutoffDate =
                req.body.cutoffDate === null || req.body.cutoffDate === ""
                    ? null
                    : parsePpsDate(req.body.cutoffDate, "fecha de corte");
        }

        if (req.body.status !== undefined) {
            period.status = parseBooleanFlag(req.body.status);
        }

        assertDateRange(period.startDate, period.endDate, period.cutoffDate ?? null);

        await validateEntity(period);
        await period.save();

        return res.json(period);
    } catch (error) {
        next(error);
    }
}

export async function deletePeriod(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const period = await PpsPeriod.findOneBy({ id });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        await period.remove();

        return res.json({ message: "Vigencia eliminada junto con su programación y seguimiento" });
    } catch (error) {
        next(error);
    }
}
