import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
    getAllSstComments,
    getSstCommentById,
    getCommentsByTicketId,
    createSstComment,
    createSstCommentAndChangeStatus,
    updateSstComment,
    deleteSstComment,
} from "../controllers/sst-comments.controller";

const router = Router();

/**
 * @swagger
 * /sst-comments:
 *   get:
 *     summary: Obtener todos los comentarios de SST
 *     tags: [SstComments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-comments", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), getAllSstComments);

/**
 * @swagger
 * /sst-comments/ticket/{ticketId}:
 *   get:
 *     summary: Obtener comentarios de un ticket de SST
 *     tags: [SstComments]
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
 *         description: Lista de comentarios del ticket
 *       404:
 *         description: No se encontraron comentarios
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-comments/ticket/:ticketId", authenticate, authorizeRoles(ROLE_GROUPS.ALL), validarId, getCommentsByTicketId);

/**
 * @swagger
 * /sst-comments/{id}:
 *   get:
 *     summary: Obtener un comentario de SST por ID
 *     tags: [SstComments]
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
 *         description: Comentario encontrado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-comments/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), validarId, getSstCommentById);

/**
 * @swagger
 * /sst-comments:
 *   post:
 *     summary: Crear un comentario en un ticket de SST
 *     tags: [SstComments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - userId
 *               - comment
 *             properties:
 *               ticketId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-comments", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), createSstComment);

/**
 * @swagger
 * /sst-comments/status:
 *   post:
 *     summary: Crear comentario y cambiar estado de un ticket de SST
 *     tags: [SstComments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - userId
 *               - comment
 *               - status
 *             properties:
 *               ticketId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               comment:
 *                 type: string
 *               status:
 *                 type: integer
 *               quotationAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Comentario creado y estado actualizado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-comments/status", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), createSstCommentAndChangeStatus);

/**
 * @swagger
 * /sst-comments/{id}:
 *   put:
 *     summary: Actualizar un comentario de SST
 *     tags: [SstComments]
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
 *         description: Comentario actualizado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/sst-comments/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), validarId, updateSstComment);

/**
 * @swagger
 * /sst-comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario de SST
 *     tags: [SstComments]
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
 *         description: Comentario eliminado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/sst-comments/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_ADMIN), validarId, deleteSstComment);

export default router;
