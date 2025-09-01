import { NextFunction, Request, Response } from "express";
import { CVTokenService } from "../services/cv-token.service";
import fs from "fs";
import path from "path";

/**
 * Diferencias con serveSecureFile:
 * 
 * @param req - Request con token en parámetros
 * @param res - Response para servir el archivo
 * @param next - NextFunction para manejo de errores
 */
export async function servePublicCV(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        if (!token) {
            return res.status(400).json({ 
                message: "Token requerido para acceder al CV" 
            });
        }

        // Validar token de CV público
        const validation = CVTokenService.validateCVAccessToken(token, clientIP);
        
        if (!validation.valid) {
            return res.status(403).json({ 
                message: "Token de CV inválido o expirado",
                error: validation.error 
            });
        }

        const { cvFileName, originalName, action } = validation.payload!;

        // Construir ruta del CV en FilesEmails
        const cvPath = path.resolve(__dirname, "..", 'uploads', 'FilesEmails', cvFileName);
        
        if (!fs.existsSync(cvPath)) {
            return res.status(404).json({ 
                message: "CV no encontrado en el servidor" 
            });
        }

        // Registrar acceso para auditoría
        console.log(`CV Público accedido: ${originalName} (${cvFileName}) - Acción: ${action} - IP: ${clientIP} - Token: ${validation.payload!.jti}`);

        // Determinar cómo servir el archivo
        if (action === 'DOWNLOAD') {
            // Forzar descarga con nombre original
            res.download(cvPath, originalName, (err) => {
                if (err) {
                    console.error(`Error descargando CV: ${err.message}`);
                    if (!res.headersSent) {
                        res.status(500).json({ 
                            message: "Error al descargar el CV" 
                        });
                    }
                }
            });
        } else {
            // VIEW - Mostrar en el navegador
            const stat = fs.statSync(cvPath);
            
            // Headers para visualización en navegador
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf'); // Asumimos que los CVs son PDFs
            res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
            res.setHeader('Cache-Control', 'private, max-age=300'); // Cache de 5 minutos
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');

            // Crear stream para el archivo
            const fileStream = fs.createReadStream(cvPath);
            fileStream.pipe(res);
            
            fileStream.on('error', (err) => {
                console.error(`Error leyendo CV: ${err.message}`);
                if (!res.headersSent) {
                    res.status(500).json({ 
                        message: "Error al acceder al CV" 
                    });
                }
            });
        }

    } catch (error) {
        console.error(`Error en servePublicCV: ${error}`);
        next(error);
    }
}

/**
 * Endpoint para generar tokens de acceso a CV (uso interno/debugging)
 * @param req - Request con datos del CV
 * @param res - Response con tokens generados
 * @param next - NextFunction para manejo de errores
 */
export async function generateCVTokens(req: Request, res: Response, next: NextFunction) {
    try {
        const { cvFileName, originalName, expirationDays = 30 } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        if (!cvFileName || !originalName) {
            return res.status(400).json({
                message: "cvFileName y originalName son requeridos"
            });
        }

        // Verificar que el CV existe
        const cvPath = path.resolve(__dirname, "..", 'uploads', 'FilesEmails', cvFileName);
        if (!fs.existsSync(cvPath)) {
            return res.status(404).json({
                message: "CV no encontrado"
            });
        }

        const tokens = CVTokenService.generateCVTokens(
            cvFileName, 
            originalName, 
            clientIP, 
            expirationDays
        );

        return res.status(200).json({
            message: "Tokens de CV generados exitosamente",
            ...tokens
        });

    } catch (error) {
        next(error);
    }
}
