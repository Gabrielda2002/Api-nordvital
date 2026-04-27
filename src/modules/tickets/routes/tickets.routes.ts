import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createTicket, deleteTicket, getAllTickets, getListTicketsByUserId, getTicketById, getTicketsTable, updateTicket } from "../controllers/tickets.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { multerTicketAttachment } from "@core/middlewares/multer-ticket.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

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
router.get('/tickets', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllTickets)

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
router.get('/tickets/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getTicketById)

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
router.post('/tickets', authenticate, authorizeRoles(ROLE_GROUPS.ALL), multerTicketAttachment.single("file"), createTicket)

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
router.put('/tickets/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, updateTicket)

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
router.delete('/tickets/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteTicket)

/**
 * @swagger
 * /tickets-table:
 *   get:
 *     summary: Obtener todos los tickets con información detallada para mostrar en tabla
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de tickets con información detallada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tickets'
 *       404:
 *         description: No se encontraron tickets
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tickets-table', authenticate, authorizeRoles(ROLE_GROUPS.ADMIN_SUPPORT), getTicketsTable);

router.get('/tickets/user/:id', authenticate, authorizeRoles(ROLE_GROUPS.ALL), validarId, getListTicketsByUserId);

export default router;
