import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ReportDescriptor } from "./types";
import { NotFoundError } from "@core/utils/custom-errors";
import { sendExcelResponse } from "./excel-engine";

export function buildPreviewHandler<F extends object>(
    d: ReportDescriptor<F>
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = d.parseFilters ? d.parseFilters(req.body, req) : (req.body as F);
            const data = await d.fetchRows(filters, d.previewLimit ?? 20);

            if (!data || data.length === 0) {
                throw new NotFoundError(d.previewNotFoundMessage ?? d.notFoundMessage ?? `Data ${d.name} not found.`);
            }

            res.status(200).json({ total: data.length, data });
        } catch (error) {
            next(error);
        }
    };
}

export function buildExportHandler<F extends object>(
    d: ReportDescriptor<F>
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = d.parseFilters ? d.parseFilters(req.body, req) : (req.body as F);
            const rows = await d.fetchRows(filters);

            if (d.onEmpty === "throw-404" && (!rows || rows.length === 0)) {
                throw new NotFoundError(d.notFoundMessage ?? `Data ${d.name} not found.`);
            }

            await sendExcelResponse(res, d, rows);
        } catch (error) {
            next(error);
        }
    };
}
