import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction){
    logger.info(
        `Request received:\n` +
        `Method: ${req.method}\n` +
        `URL: ${req.url}\n` +
        `Body: ${JSON.stringify(req.body, null, 2)}\n` + // Formateado para legibilidad
        `Headers: ${JSON.stringify(req.headers, null, 2)}\n`
    );
    next();
}