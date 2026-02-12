import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { 
    getTicketAttachments, 
    uploadTicketAttachment, 
    deleteTicketAttachment,
    getTicketAttachmentById
} from "../controllers/ticket-attachments.controller";
import { multerTicketAttachment } from "../middlewares/multer-ticket.middleware";

const router = Router();

/**
 * @swagger
 * /tickets/{ticketId}/attachments:
 *   get:
 *     summary: Obtener todos los adjuntos de un ticket
 *     tags: [Ticket Attachments]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Lista de adjuntos del ticket
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    "/tickets/:ticketId/attachments",
    authenticate,
    authorizeRoles(["1", "17"]),
    validarId,
    getTicketAttachments
);

/**
 * @swagger
 * /tickets/{ticketId}/attachments:
 *   post:
 *     summary: Subir un archivo adjunto a un ticket
 *     tags: [Ticket Attachments]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir
 *               attachmentType:
 *                 type: string
 *                 enum: [screenshot, log, document, pdf, video, other]
 *                 description: Tipo de adjunto
 *               isInternal:
 *                 type: boolean
 *                 description: Si el adjunto es solo visible para soporte
 *     responses:
 *       201:
 *         description: Archivo subido exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    "/tickets/:ticketId/attachments",
    authenticate,
    authorizeRoles(["1", "17"]),
    validarId,
    multerTicketAttachment.single("file"),
    uploadTicketAttachment
);

/**
 * @swagger
 * /attachments/{attachmentId}:
 *   get:
 *     summary: Obtener detalles de un adjunto específico
 *     tags: [Ticket Attachments]
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del adjunto
 *     responses:
 *       200:
 *         description: Detalles del adjunto
 *       403:
 *         description: No autorizado para ver este adjunto
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    "/attachments/:attachmentId",
    authenticate,
    authorizeRoles(["1", "17"]),
    validarId,
    getTicketAttachmentById
);

/**
 * @swagger
 * /attachments/{attachmentId}:
 *   delete:
 *     summary: Eliminar un adjunto
 *     tags: [Ticket Attachments]
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del adjunto
 *     responses:
 *       200:
 *         description: Adjunto eliminado exitosamente
 *       403:
 *         description: No autorizado para eliminar este adjunto
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
    "/attachments/:attachmentId",
    authenticate,
    authorizeRoles(["1", "17"]),
    validarId,
    deleteTicketAttachment
);

export default router;
