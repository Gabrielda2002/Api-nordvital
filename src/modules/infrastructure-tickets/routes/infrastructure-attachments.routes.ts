import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { multerInfrastructureTicket } from "@core/middlewares/multer-infrastructure-ticket.middleware";
import {
    getInfrastructureTicketAttachments,
    uploadInfrastructureAttachment,
    deleteInfrastructureAttachment,
    getInfrastructureAttachmentById,
    generateInfrastructureAttachmentDownloadToken,
    downloadInfrastructureAttachment,
} from "../controllers/infrastructure-attachments.controller";

const ALL_ROLES = ['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
const INFRA_MANAGEMENT = ['1', '22', '23'];

const router = Router();

/**
 * @swagger
 * /infrastructure-attachments/ticket/{ticketId}:
 *   get:
 *     summary: Obtener adjuntos de un ticket de infraestructura
 *     tags: [InfrastructureAttachments]
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
router.get("/infrastructure-attachments/ticket/:ticketId", authenticate, authorizeRoles(ALL_ROLES), getInfrastructureTicketAttachments);

/**
 * @swagger
 * /infrastructure-attachments/download/{token}:
 *   get:
 *     summary: Descargar un adjunto de infraestructura con token temporal
 *     tags: [InfrastructureAttachments]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token temporal de descarga
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
router.get("/infrastructure-attachments/download/:token", downloadInfrastructureAttachment);

/**
 * @swagger
 * /infrastructure-attachments/{attachmentId}:
 *   get:
 *     summary: Obtener un adjunto de infraestructura por ID
 *     tags: [InfrastructureAttachments]
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
router.get("/infrastructure-attachments/:attachmentId", authenticate, authorizeRoles(ALL_ROLES), getInfrastructureAttachmentById);

/**
 * @swagger
 * /infrastructure-attachments/token/{id}/access-token:
 *   get:
 *     summary: Generar token temporal de descarga para adjunto de infraestructura
 *     tags: [InfrastructureAttachments]
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
router.post("/infrastructure-attachments/token/:id/access-token", authenticate, authorizeRoles(ALL_ROLES), validarId, generateInfrastructureAttachmentDownloadToken);

/**
 * @swagger
 * /infrastructure-attachments/ticket/{ticketId}:
 *   post:
 *     summary: Subir adjunto a un ticket de infraestructura
 *     tags: [InfrastructureAttachments]
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
router.post("/infrastructure-attachments/ticket/:ticketId", authenticate, authorizeRoles(INFRA_MANAGEMENT), multerInfrastructureTicket.single("file"), uploadInfrastructureAttachment);

/**
 * @swagger
 * /infrastructure-attachments/{attachmentId}:
 *   delete:
 *     summary: Eliminar un adjunto de infraestructura
 *     tags: [InfrastructureAttachments]
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
router.delete("/infrastructure-attachments/:attachmentId", authenticate, authorizeRoles(INFRA_MANAGEMENT), deleteInfrastructureAttachment);

export default router;
