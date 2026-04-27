import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createComment, createCommentAndChangeTicketStatus, deleteComment, getAllComments, getCommentById, getCommentsByTicket, updateComment } from "../controllers/comentarios.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios]
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentarios'
 */
router.get('/comentarios', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllComments);

/**
 * @swagger
 * /comentarios/{id}:
 *   get:
 *     summary: Obtener un comentario por ID
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentarios'
 *       404:
 *         description: Comentario no encontrado
 */
router.get('/comentarios/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getCommentById);

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comentarios'
 *     responses:
 *       200:
 *         description: Comentario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentarios'
 *       400:
 *         description: Error al crear comentario
 */
router.post('/comentarios', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), createComment);

/**
 * @swagger
 * /comentarios/{id}:
 *   put:
 *     summary: Actualizar un comentario
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comentarios'
 *     responses:
 *       200:
 *         description: Comentario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentarios'
 *       400:
 *         description: Error al actualizar comentario
 *       404:
 *         description: Comentario no encontrado
 */
router.put('/comentarios/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, updateComment);

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       404:
 *         description: Comentario no encontrado
 */
router.delete('/comentarios/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteComment);

/**
 * @swagger
 * /comment-status:
 *   post:
 *     summary: Crear comentario y cambiar el estado de un ticket
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - usuarioId
 *               - coment
 *               - status
 *             properties:
 *               ticketId:
 *                 type: integer
 *                 description: ID del ticket
 *               usuarioId:
 *                 type: integer
 *                 description: ID del usuario
 *               coment:
 *                 type: string
 *                 description: Comentario
 *               status:
 *                 type: integer
 *                 description: Nuevo estado del ticket
 *     responses:
 *       200:
 *         description: Comentario creado y estado de ticket actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentarios'
 *       400:
 *         description: Error al crear comentario
 *       404:
 *         description: Ticket no encontrado
 */
router.post('/comment-status', authenticate, authorizeRoles(ROLE_GROUPS.ADMIN_SUPPORT), createCommentAndChangeTicketStatus);

/**
 * @swagger
 * /comment/tickets/{id}:
 *   get:
 *     summary: Obtener comentarios por ticket
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Lista de comentarios del ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentarios'
 *       404:
 *         description: Comentarios no encontrados
 */
router.get('/comment/tickets/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.CALIDAD, ROLE_IDS.AUXILIAR, ROLE_IDS.COORDINADOR, ROLE_IDS.RADICADOR, ROLE_IDS.SIAU, ROLE_IDS.CONTRATACION, ROLE_IDS.MEDICO, ROLE_IDS.JEFE, ROLE_IDS.CIRUGIA, ROLE_IDS.PARAMEDICO, ROLE_IDS.SOPORTE, ROLE_IDS.RRHH]),validarId ,getCommentsByTicket);

export default router;
