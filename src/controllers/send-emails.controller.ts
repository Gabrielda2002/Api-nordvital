import { NextFunction, Request, Response } from "express";
import { CVTokenService } from "../services/cv-token.service";

export async function sendEmailWorkUs(req: Request, res: Response, next: NextFunction){
    try {
        
        const cv = req.file;

        if (!cv) {
            return res.status(400).json({ message: "CV es requerido" });
        }

        console.log('CV recibido:', cv.originalname, '-> Guardado como:', cv.filename);

        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        // Generar tokens para el CV (visualizar y descargar)
        const tokens = CVTokenService.generateCVTokens(
            cv.filename,          
            cv.originalname,       
            clientIP,              
            30                     // 30 días de expiración
        );

        // Construir URLs completas para el email
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const viewUrl = `${baseUrl}${tokens.viewUrl}`;
        const downloadUrl = `${baseUrl}${tokens.downloadUrl}`;

        console.log('Tokens generados para CV:', {
            originalName: cv.originalname,
            fileName: cv.filename,
            viewUrl: viewUrl,
            downloadUrl: downloadUrl,
            expiresInDays: tokens.expiresInDays
        });

        res.status(200).json({
            message: "CV procesado correctamente",
            cv: {
                originalName: cv.originalname,
                size: cv.size,
                mimeType: cv.mimetype
            },
            access: {
                viewUrl: viewUrl,
                downloadUrl: downloadUrl,
                expiresInDays: tokens.expiresInDays,
                note: "Estos enlaces son válidos por 30 días y pueden ser usados en emails públicos"
            }
        });

    } catch (error) {
        console.error('Error procesando CV:', error);
        next(error);
    }
}