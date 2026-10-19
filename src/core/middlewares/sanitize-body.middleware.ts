import { NextFunction, Request, Response } from "express";
import { normalizeText } from "@core/utils/search-helper";

const NAME_KEYS = new Set(["name", "nombre"]);

/**
 * Middleware para sanitizar los strings del body de la petición.
 * Aplica trim a todos los strings y normaliza los campos de nombre
 * (name/nombre) colapsando los espacios internos de forma recursiva.
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
 * Sanitiza recursivamente un objeto, aplicando trim a todos los strings y
 * normalizando los campos de nombre (name/nombre).
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
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const isNameKey = NAME_KEYS.has(key.toLowerCase());

                sanitized[key] =
                    isNameKey && typeof value === 'string'
                        ? normalizeText(value)
                        : sanitizeObject(value);
            }
        }
        return sanitized;
    }

    // Para otros tipos (number, boolean, etc.), retornar sin cambios
    return obj;
}
