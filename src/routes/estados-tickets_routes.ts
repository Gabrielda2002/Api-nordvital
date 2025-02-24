import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createStatusTicket, deleteStatusTicket, getAllStatusTickets, getStatusTicketById, updateStatusTicket } from "../controllers/estados-tickets_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router()

/**
 * @swagger
 * /estados-tickets:
 *   get:
 *     summary: Obtener todos los estados de tickets
 *     tags: [Estados Tickets]
 *     responses:
 *       200:
 *         description: Lista de estados de tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstadosTickets'
 */
router.get('/estados-tickets', authenticate, authorizeRoles, getAllStatusTickets);

/**
 * @swagger
 * /estados-tickets/{id}:
 *   get:
 *     summary: Obtener un estado de ticket por ID
 *     tags: [Estados Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estado de ticket
 *     responses:
 *       200:
 *         description: Estado de ticket encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadosTickets'
 *       404:
 *         description: Estado de ticket no encontrado
 */
router.get('/estados-tickets/:id', authenticate, authorizeRoles, validarId, getStatusTicketById);

/**
 * @swagger
 * /estados-tickets:
 *   post:
 *     summary: Crear un nuevo estado de ticket
 *     tags: [Estados Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstadosTickets'
 *     responses:
 *       200:
 *         description: Estado de ticket creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadosTickets'
 */
router.post('/estados-tickets', authenticate, authorizeRoles, createStatusTicket);

/**
 * @swagger
 * /estados-tickets/{id}:
 *   put:
 *     summary: Actualizar un estado de ticket por ID
 *     tags: [Estados Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estado de ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstadosTickets'
 *     responses:
 *       200:
 *         description: Estado de ticket actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadosTickets'
 *       404:
 *         description: Estado de ticket no encontrado
 */
router.put('/estados-tickets/:id', authenticate, authorizeRoles, validarId, updateStatusTicket);

/**
 * @swagger
 * /estados-tickets/{id}:
 *   delete:
 *     summary: Eliminar un estado de ticket por ID
 *     tags: [Estados Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estado de ticket
 *     responses:
 *       200:
 *         description: Estado de ticket eliminado
 *       404:
 *         description: Estado de ticket no encontrado
 */
router.delete('/estados-tickets/:id', authenticate, authorizeRoles, validarId, deleteStatusTicket);

export default router;