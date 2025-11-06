import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function errorLoggerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    // Extraer información relevante de la petición
    const url = req.originalUrl || req.url;
    const method = req.method;
    const userId = (req as any).user?.id || 'unauthenticated';
    
    // Recopilar información contextual para diagnóstico
    const errorContext: {
        error: {
            name: string;
            message: string;
            stack?: string;
        };
        request: {
            method: string;
            url: string;
            userId: any;
            ip: string | undefined;
            headers: {
                'user-agent': string | undefined;
                'content-type': string | undefined;
                'referer': string | undefined;
            };
            validationErrors?: any;
            body?: any;
        };
    } = {
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack
        },
        request: {
            method,
            url,
            userId,
            ip: req.ip,
            // Solo incluir headers relevantes para diagnóstico
            headers: {
                'user-agent': req.headers['user-agent'],
                'content-type': req.headers['content-type'],
                'referer': req.headers.referer
            }
        }
    };

    // Para errores de validación, solo incluir los campos con errores
    if (err.name === 'ValidationError' && typeof (err as any).errors === 'object') {
        errorContext.request.validationErrors = (err as any).errors;
    } else {
        // Solo incluir body para errores que no sean de validación si no es demasiado grande
        const contentType = req.headers['content-type'] as string || '';
        if (req.body && 
            !contentType.includes('multipart/form-data') && 
            Object.keys(req.body).length > 0) {
            
            const bodyString = JSON.stringify(req.body);
            if (bodyString.length < 1000) {
                errorContext.request.body = req.body;
            } else {
                // Para bodies grandes, solo incluir un resumen
                errorContext.request.body = {
                    _note: `Request body too large (${bodyString.length} chars)`,
                    _keys: Object.keys(req.body)
                };
            }
        }
    }

    // Categorizar la severidad del error basado en el código de estado HTTP
    let logLevel = 'error';
    
    // Si ya se ha establecido un código de estado, usarlo para determinar la severidad
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    if (statusCode >= 500) {
        logLevel = 'error'; // Errores del servidor
    } else if (statusCode >= 400) {
        logLevel = 'warn';  // Errores del cliente
    }

    // Registro de error con información contextual apropiada
    logger[logLevel as 'error' | 'warn'](`Error: ${err.message}`, errorContext);

    next(err);
}