import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { multerSstTicket } from "@core/middlewares/multer-sst-ticket.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
    getSstTicketAttachments,
    uploadSstAttachment,
    deleteSstAttachment,
    getSstAttachmentById,
    generateSstAttachmentDownloadToken,
    downloadSstAttachment,
} from "../controllers/sst-attachments.controller";

const router = Router();

/**
 * @swagger
 * /sst-attachments/ticket/{ticketId}:
 *   get:
 *     summary: Obtener adjuntos de un ticket de SST
 *     tags: [SstAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de adjuntos
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-attachments/ticket/:ticketId", authenticate, authorizeRoles(ROLE_GROUPS.ALL), getSstTicketAttachments);

/**
 * @swagger
 * /sst-attachments/download/{token}:
 *   get:
 *     summary: Descargar un adjunto de SST con token temporal
 *     tags: [SstAttachments]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Archivo descargado
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-attachments/download/:token", downloadSstAttachment);

/**
 * @swagger
 * /sst-attachments/{attachmentId}:
 *   get:
 *     summary: Obtener un adjunto de SST por ID
 *     tags: [SstAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Adjunto encontrado
 *       403:
 *         description: Sin autorización para ver adjunto interno
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-attachments/:attachmentId", authenticate, authorizeRoles(ROLE_GROUPS.ALL), getSstAttachmentById);

/**
 * @swagger
 * /sst-attachments/token/{id}/access-token:
 *   post:
 *     summary: Generar token temporal de descarga para adjunto de SST
 *     tags: [SstAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Token generado
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-attachments/token/:id/access-token", authenticate, authorizeRoles(ROLE_GROUPS.ALL), validarId, generateSstAttachmentDownloadToken);

/**
 * @swagger
 * /sst-attachments/ticket/{ticketId}:
 *   post:
 *     summary: Subir adjunto a un ticket de SST
 *     tags: [SstAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               attachmentType:
 *                 type: string
 *                 enum: [photo, document, pdf, video, other]
 *               isInternal:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Adjunto subido exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-attachments/ticket/:ticketId", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), multerSstTicket.single("file"), uploadSstAttachment);

/**
 * @swagger
 * /sst-attachments/{attachmentId}:
 *   delete:
 *     summary: Eliminar un adjunto de SST
 *     tags: [SstAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Adjunto eliminado
 *       403:
 *         description: Sin autorización para eliminar
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/sst-attachments/:attachmentId", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), deleteSstAttachment);

export default router;
