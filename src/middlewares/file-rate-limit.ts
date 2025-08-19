import rateLimit from 'express-rate-limit';
import { Request } from 'express';

/**
 * Rate limiting específico para acceso a archivos
 * Limita las solicitudes por usuario autenticado
 */
export const fileAccessRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 solicitudes de tokens por usuario cada 15 minutos
    keyGenerator: (req: Request) => {
        // Usar el ID del usuario si está autenticado, sino usar IP
        const user = (req as any).user;
        return user?.id?.toString() || req.ip;
    },
    message: {
        error: 'Demasiadas solicitudes de archivos',
        message: 'Has excedido el límite de solicitudes de archivos. Inténtalo más tarde.',
        retryAfter: 15 * 60 // segundos
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests, only count failed attempts and token generation
    skipSuccessfulRequests: false,
    skipFailedRequests: false
});

/**
 * Rate limiting más estricto para la descarga de archivos
 */
export const fileDownloadRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 20, // máximo 20 descargas cada 5 minutos por usuario
    keyGenerator: (req: Request) => {
        const user = (req as any).user;
        return user?.id?.toString() || req.ip;
    },
    message: {
        error: 'Demasiadas descargas',
        message: 'Has excedido el límite de descargas. Inténtalo más tarde.',
        retryAfter: 5 * 60
    }
});
