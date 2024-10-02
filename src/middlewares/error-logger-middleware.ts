import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function errorLoggerMiddleware(err: Error, req: Request, res: Response, next: NextFunction){
    logger.error(`
        Error: ${err.message}\n` +
        `Method: ${req.method}\n` +
        `URL: ${req.url}\n` +
        `Body: ${JSON.stringify(req.body, null, 2)}\n` + // Formateado para legibilidad
        `Headers: ${JSON.stringify(req.headers, null, 2)}\n`
    );

    next(err);
}