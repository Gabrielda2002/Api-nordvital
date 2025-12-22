import { NextFunction, Request, Response } from "express";
import Logger from "../utils/logger-wrapper";

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction){
    Logger.error('Error en request', error, {
        method: req.method,
        url: req.url,
        body: req.body,
    });

    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({ message });   
}