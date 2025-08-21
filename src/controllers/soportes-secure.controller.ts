import { NextFunction, Request, Response } from "express";
import { Soportes } from "../entities/soportes";
import path from "path";
import fs from "fs";
import { FileTokenService } from "../services/file-token.service";

/**
 * Genera un token temporal para acceder a un soporte de forma segura
 */
export async function generateSoporteAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { action } = req.query;
        const user = (req as any).user;
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        // Validar parámetros
        const soporteId = parseInt(id);
        const actionType = (action as string)?.toUpperCase() as 'VIEW' | 'DOWNLOAD';
        
        if (!soporteId || !actionType || !['VIEW', 'DOWNLOAD'].includes(actionType)) {
            return res.status(400).json({ 
                message: "ID de soporte y acción requeridos. Acción debe ser VIEW o DOWNLOAD" 
            });
        }

        // Verificar que el soporte existe
        const soporte = await Soportes.findOne({ where: { id: soporteId } });
        if (!soporte) {
            return res.status(404).json({ message: "Soporte no encontrado" });
        }

        // TODO: Validar permisos específicos del soporte basado en roles
        
        // Generar token temporal usando el ID del soporte como fileId
        const token = FileTokenService.generateFileAccessToken(
            soporteId,
            user.id,
            user.rol,
            actionType,
            clientIP,
            15 // 15 minutos de expiración
        );

        return res.status(200).json({
            token,
            expiresIn: 900,
            url: `/api/v1/secure-soporte/${token}`,
            action: actionType
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Sirve un soporte de forma segura validando el token temporal
 */
export async function serveSecureSoporte(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        if (!token) {
            return res.status(400).json({ message: "Token requerido" });
        }

        // Validar token
        const validation = FileTokenService.validateFileAccessToken(token, clientIP);
        
        if (!validation.valid) {
            return res.status(403).json({ 
                message: "Token inválido o expirado",
                error: validation.error 
            });
        }

        const { fileId, action } = validation.payload!; // fileId es el soporteId

        // Buscar el soporte
        const soporte = await Soportes.findOne({ where: { id: fileId } });
        if (!soporte) {
            return res.status(404).json({ message: "Soporte no encontrado" });
        }

        // La URL en soporte ya incluye la ruta completa
        const filePath = soporte.url;
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Archivo de soporte no encontrado en el servidor" });
        }

        // TODO: Aquí registrarías el acceso para auditoría
        console.log(`Soporte accedido: ${soporte.name} por usuario: ${validation.payload!.userId} - Acción: ${action}`);

        // Determinar cómo servir el archivo
        if (action === 'DOWNLOAD') {
            // Forzar descarga
            res.download(filePath, soporte.nameSaved, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error al descargar el soporte" });
                }
            });
        } else {
            // VIEW - Mostrar en el navegador
            const stat = fs.statSync(filePath);
            
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', soporte.type);
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            
            fileStream.on('error', (err) => {
                console.error('Error streaming soporte:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error al cargar el soporte" });
                }
            });
        }

    } catch (error) {
        next(error);
    }
}
