import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path, { parse } from "path";
import { PqrsdfCommentService } from "../services/pqrsdf-comments.service";
import { Pqrsdf } from "../entities/pqrsdf";
import { NotFoundError } from "@core/utils/custom-errors";
import { FileTokenService } from "../../documents/services/file-token.service";
import Logger from "@core/utils/logger-wrapper";

const service = new PqrsdfCommentService();

export async function createPqrsdfComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { comment } = req.body;

        const pqrsdfId = parseInt(String(id));
        
        const pqrsdfExists = await Pqrsdf.existsBy({ id: pqrsdfId });

        if (!pqrsdfExists) {
            return res.status(404).json({ message: "Pqrsdf not found"})
        }
        
        const file = req.file as Express.Multer.File | undefined;

        const created = await service.create({
            pqrsdfId,
            authorId: userId,
            comment: comment,
            file,
        });

        Logger.info(`Comentario creado en PQRSDF ${pqrsdfId} por el usuario ${userId}`);

        return res.status(201).json(created);
    } catch (error) {
        next(error);
    }
}

export async function getPqrsdfComments(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const pqrsdfId = parseInt(String(id));

        const comments = await service.findAllByPqrsdf(pqrsdfId);

        const formatted = comments.map((comment) => ({
            id: comment.id,
            author: `${comment.authorRelation?.name} ${comment.authorRelation?.lastName}`,
            position: comment.authorRelation?.positionRelation?.name,
            comment: comment.comment,
            createdAt: comment.createdAt,
            attachment: (comment.attachmentsRelation ?? []).length > 0
                ? {
                    id: comment.attachmentsRelation[0].id,
                    fileName: comment.attachmentsRelation[0].fileName,
                    mimeType: comment.attachmentsRelation[0].mimeType,
                    fileSize: comment.attachmentsRelation[0].fileSize,
                    accessTokenUrl: `/pqrsdf/comments/${comment.attachmentsRelation[0].id}/access-token`,
                }
                : null,
        }));

        return res.json(formatted);
    } catch (error) {
        next(error);
    }
}

/**
 * Genera un token temporal para acceder de forma segura al adjunto de un comentario
 */
export async function generatePqrsdfCommentAttachmentToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { action } = req.query;
        const user = (req as any).user;

        const parseId = Number(id)

        const clientIP = req.ip || req.connection.remoteAddress || "unknown";

        // Validar parámetros
        const actionType = (action as string)?.toUpperCase() as "VIEW" | "DOWNLOAD";

        if (!id || !actionType || !["VIEW", "DOWNLOAD"].includes(actionType)) {
            return res.status(400).json({
                message: "ID de adjunto y acción requeridos. Acción debe ser VIEW o DOWNLOAD",
            });
        }

        // Verificar que el adjunto existe
        const attachment = await service.getAttachment(parseId);
        if (!attachment) {
            return res.status(404).json({ message: "Adjunto no encontrado" });
        }

        // Generar token temporal usando el ID del adjunto como fileId
        const token = FileTokenService.generateFileAccessToken(
            parseId,
            user.id,
            user.rol,
            actionType,
            clientIP,
            15 // 15 minutos de expiración
        );

        return res.status(200).json({
            token,
            expiresIn: 900,
            url: `/api/v1/secure-pqrsdf-attachment/${token}`,
            action: actionType,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Sirve el adjunto de un comentario de forma segura validando el token temporal
 */
export async function serveSecurePqrsdfCommentAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const clientIP = req.ip || req.connection.remoteAddress || "unknown";

        if (!token) {
            return res.status(400).json({ message: "Token requerido" });
        }

        // Validar token
        const validation = FileTokenService.validateFileAccessToken(String(token), clientIP);

        if (!validation.valid) {
            return res.status(403).json({
                message: "Token inválido o expirado",
                error: validation.error,
            });
        }

        const { fileId, action } = validation.payload!; // fileId es el attachmentId

        // Buscar el adjunto
        const attachment = await service.getAttachment(fileId);
        if (!attachment) {
            return res.status(404).json({ message: "Adjunto no encontrado" });
        }

        // Resolver la ruta relativa dentro de la carpeta de uploads
        const relativePath = attachment.filePath.replace(/^\//, "");
        const filePath = path.join(__dirname, "..", "..", "..", "uploads", relativePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Archivo adjunto no encontrado en el servidor" });
        }

        Logger.info(`Adjunto de comentario PQRSDF accedido: ${attachment.fileName} por usuario: ${validation.payload!.userId} - Acción: ${action}`);

        // Determinar cómo servir el archivo
        if (action === "DOWNLOAD") {
            // Forzar descarga
            res.download(filePath, attachment.fileName, (err) => {
                if (err && !res.headersSent) {
                    res.status(500).json({ message: "Error al descargar el adjunto" });
                }
            });
        } else {
            // VIEW - Mostrar en el navegador
            const stat = fs.statSync(filePath);

            res.setHeader("Content-Length", stat.size);
            res.setHeader("Content-Type", attachment.mimeType);
            res.setHeader("Content-Disposition", "inline");
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            fileStream.on("error", (err) => {
                Logger.error("Error al transmitir el adjunto", err);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error al cargar el adjunto" });
                }
            });
        }
    } catch (error) {
        next(error);
    }
}
