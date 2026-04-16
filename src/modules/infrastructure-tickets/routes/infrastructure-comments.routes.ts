import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import {
    getAllInfrastructureComments,
    getInfrastructureCommentById,
    createInfrastructureComment,
    updateInfrastructureComment,
    deleteInfrastructureComment,
    createInfrastructureCommentAndChangeStatus,
    getInfrastructureCommentsByTicket,
} from "../controllers/infrastructure-comments.controller";

const ALL_ROLES = ['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
const INFRA_MANAGEMENT = ['1', '22', '23'];
const INFRA_ADMIN = ['1', '22'];

const router = Router();

/**
 * @swagger
 * /infrastructure-comments:
 *   get:
 *     summary: Obtener todos los comentarios de infraestructura
 *     tags: [InfrastructureComments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infrastructure-comments", authenticate, authorizeRoles(INFRA_MANAGEMENT), getAllInfrastructureComments);

/**
 * @swagger
 * /infrastructure-comments/ticket/{id}:
 *   get:
 *     summary: Obtener comentarios de un ticket de infraestructura
 *     tags: [InfrastructureComments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Comentarios del ticket
 *       404:
 *         description: No se encontraron comentarios
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infrastructure-comments/ticket/:id", authenticate, authorizeRoles(ALL_ROLES), validarId, getInfrastructureCommentsByTicket);

/**
 * @swagger
 * /infrastructure-comments/{id}:
 *   get:
 *     summary: Obtener un comentario de infraestructura por ID
 *     tags: [InfrastructureComments]
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
router.get("/infrastructure-comments/:id", authenticate, authorizeRoles(INFRA_MANAGEMENT), validarId, getInfrastructureCommentById);

/**
 * @swagger
 * /infrastructure-comments:
 *   post:
 *     summary: Crear un comentario en un ticket de infraestructura
 *     tags: [InfrastructureComments]
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
router.post("/infrastructure-comments", authenticate, authorizeRoles(ALL_ROLES), createInfrastructureComment);

/**
 * @swagger
 * /infrastructure-comments/change-status:
 *   post:
 *     summary: Crear comentario y cambiar estado del ticket de infraestructura
 *     tags: [InfrastructureComments]
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
 *                 description: ID del nuevo estado del ticket
 *     responses:
 *       200:
 *         description: Comentario creado y estado actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/infrastructure-comments/change-status", authenticate, authorizeRoles(INFRA_MANAGEMENT), createInfrastructureCommentAndChangeStatus);

/**
 * @swagger
 * /infrastructure-comments/{id}:
 *   put:
 *     summary: Actualizar un comentario de infraestructura
 *     tags: [InfrastructureComments]
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
router.put("/infrastructure-comments/:id", authenticate, authorizeRoles(INFRA_MANAGEMENT), validarId, updateInfrastructureComment);

/**
 * @swagger
 * /infrastructure-comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario de infraestructura
 *     tags: [InfrastructureComments]
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
router.delete("/infrastructure-comments/:id", authenticate, authorizeRoles(INFRA_ADMIN), validarId, deleteInfrastructureComment);

export default router;
