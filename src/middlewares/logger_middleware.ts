import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    // Extraer solo datos útiles y evitar logging de rutas comunes
    const url = req.originalUrl || req.url;
    
    // No registrar peticiones a rutas estáticas o de monitoreo
    if (url.startsWith('/api/v1/uploads') || url === '/ping') {
        return next();
    }
    
    // Extraer solo headers importantes
    const relevantHeaders = {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length'],
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip
    };
    
    // Límite de tamaño para el cuerpo de la petición
    const MAX_BODY_LOG_SIZE = 500;  // caracteres
    
    // Solo registrar cuerpo si no es multipart/form-data (archivos) y si no es demasiado grande
    let body = {};
    const contentType = req.headers['content-type'] as string || '';
    if (req.body && !contentType.includes('multipart/form-data')) {
        if (Object.keys(req.body).length > 0) {
            body = req.body;
        }
    }
    
    // Log en formato estructurado para el procesamiento eficiente
    logger.http('Incoming request', {
        method: req.method,
        url: url,
        ip: req.ip,
        headers: relevantHeaders,
        body: body,
        timestamp: new Date().toISOString()
    });
    
    // Medir tiempo de respuesta
    const start = Date.now();
    
    // Interceptar la respuesta para registrar el código de estado
    res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? 'warn' : 'http';
        
        logger[level](`Response sent: ${res.statusCode}`, {
            method: req.method,
            url: url,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });
    
    next();
}