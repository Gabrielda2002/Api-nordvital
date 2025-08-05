import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createComment, createCommentAndChangeTicketStatus, deleteComment, getAllComments, getCommentById, getCommentsByTicket, updateComment } from "../controllers/comentarios.controller";
import { validarId } from "../middlewares/validar-id";

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
router.get('/comentarios', authenticate, authorizeRoles(['1']), getAllComments);

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
router.get('/comentarios/:id', authenticate, authorizeRoles(['1']), validarId, getCommentById);

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
router.post('/comentarios', authenticate, authorizeRoles(['1']), createComment);

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
router.put('/comentarios/:id', authenticate, authorizeRoles(['1']), validarId, updateComment);

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
router.delete('/comentarios/:id', authenticate, authorizeRoles(['1']), validarId, deleteComment);

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
router.post('/comment-status', authenticate, authorizeRoles(['1', '17']), createCommentAndChangeTicketStatus);

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
router.get('/comment/tickets/:id', authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18']),validarId ,getCommentsByTicket);

export default router;