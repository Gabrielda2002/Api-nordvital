import { NextFunction, Request, Response } from "express";
import Logger from "../utils/logger-wrapper";
import { config } from "../config/environment.config";  

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction){
    Logger.error('Error en request', error, {
        method: req.method,
        url: req.url,
        body: req.body,
        name: error.name,
        statusCode: error.statusCode,
    });

    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;
    
    const message = config.server.isProduction && statusCode === 500
        ? "Internal Server Error"
        : error.message || "Internal Server Error";

    const response: any = { message };

    if (config.server.isDevelopment && error.stack) {
        response.stack = error.stack;
        response.name = error.name;
    }

    res.status(statusCode).json(response);   
}