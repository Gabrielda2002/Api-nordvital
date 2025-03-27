import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createTicket, deleteTicket, getAllTickets, getTicketById, getTicketsTable, updateTicket, validateUserTickets } from "../controllers/tickets_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de todos los tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tickets'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tickets', authenticate, authorizeRoles(['1']), getAllTickets)

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Obtener un ticket por ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tickets'
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tickets/:id', authenticate, authorizeRoles(['1']), validarId, getTicketById)

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tickets'
 *     responses:
 *       200:
 *         description: Ticket creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tickets'
 *       409:
 *         description: El usuario ya tiene un ticket
 *       500:
 *         description: Error interno del servidor
 */
router.post('/tickets', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '18']), createTicket)

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket existente
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tickets'
 *     responses:
 *       200:
 *         description: Ticket actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tickets'
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/tickets/:id', authenticate, authorizeRoles(['1']), validarId, updateTicket)

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Eliminar un ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket eliminado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/tickets/:id', authenticate, authorizeRoles(['1']), validarId, deleteTicket)

router.get('/tickets-table', authenticate, authorizeRoles(['1', '10']), getTicketsTable)

router.get('/user-ticket/:userId', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '18']), validateUserTickets)

export default router;