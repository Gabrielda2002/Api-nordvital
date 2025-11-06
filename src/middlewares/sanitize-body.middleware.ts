import { NextFunction, Request, Response } from "express";

/**
 * Middleware para sanitizar (trim) todos los strings en el body de la petición.
 * Elimina espacios al inicio y final de cada propiedad string de forma recursiva.
 * 
 * @param req - Request object
 * @param res - Response object
 * @param next - NextFunction
 */
export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
}

/**
 * Sanitiza recursivamente un objeto, aplicando trim a todos los strings.
 * 
 * @param obj - Objeto a sanitizar
 * @returns Objeto sanitizado
 */
function sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Si es un string, aplicar trim
    if (typeof obj === 'string') {
        return obj.trim();
    }

    // Si es un array, sanitizar cada elemento
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    // Si es un objeto, sanitizar cada propiedad
    if (typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }

    // Para otros tipos (number, boolean, etc.), retornar sin cambios
    return obj;
}
