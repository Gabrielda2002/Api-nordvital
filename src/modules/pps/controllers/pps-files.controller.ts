import { NextFunction, Request, Response } from "express";
import { PpsPeriod } from "../entities/pps-period";
import { NotFoundError } from "@core/utils/custom-errors";
import { parseBooleanFlag } from "@core/utils/boolean-helper";
import { buildProgrammingFile, buildMonitoringFile } from "../services/pps-file.service";

const sendTextFile = (res: Response, filename: string, content: string) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.send(content);
};

export async function downloadProgrammingFile(req: Request, res: Response, next: NextFunction) {
    try {
        const periodId = Number(req.params.id);
        const period = await PpsPeriod.findOneBy({ id: periodId });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        const file = await buildProgrammingFile(period);

        return sendTextFile(res, file.filename, file.content);
    } catch (error) {
        next(error);
    }
}

export async function downloadMonitoringFile(req: Request, res: Response, next: NextFunction) {
    try {
        const periodId = Number(req.params.id);
        const period = await PpsPeriod.findOneBy({ id: periodId });

        if (!period) {
            throw new NotFoundError("No se encontró la vigencia");
        }

        const file = await buildMonitoringFile(period, parseBooleanFlag(req.query.force));

        return sendTextFile(res, file.filename, file.content);
    } catch (error) {
        next(error);
    }
}
