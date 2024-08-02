import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction){
    logger.info(`Request method: ${req.method} URL: ${req.url}`)
    next();
}