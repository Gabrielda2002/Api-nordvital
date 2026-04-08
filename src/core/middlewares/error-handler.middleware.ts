import { NextFunction, Request, Response } from "express";
import Logger from "@core/utils/logger-wrapper";
import { config } from "@core/config/environment.config";

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

    const multerStatusCode =
        error?.name === "MulterError"
            ? error?.code === "LIMIT_FILE_SIZE"
                ? 413
                : 400
            : undefined;

    const invalidPdfStatusCode =
        error?.message === "Only pdfs are allowed" ? 400 : undefined;

    const statusCode = error.statusCode || multerStatusCode || invalidPdfStatusCode || 500;
    
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