import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { multerSstTicket } from "@core/middlewares/multer-sst-ticket.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
    getAllSstTickets,
    getSstTicketById,
    createSstTicket,
    updateSstTicket,
    deleteSstTicket,
    getSstTicketsTable,
    getSstTicketsByUserId,
} from "../controllers/sst-tickets.controller";

const router = Router();

/**
 * @swagger
 * /sst-tickets:
 *   get:
 *     summary: Obtener todos los tickets de SST
 *     tags: [SstTickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets de SST
 *       404:
 *         description: No se encontraron tickets
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-tickets", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), getAllSstTickets);

/**
 * @swagger
 * /sst-tickets/table:
 *   get:
 *     summary: Obtener tickets de SST formateados para tabla
 *     tags: [SstTickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets formateados
 *       404:
 *         description: No se encontraron tickets
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-tickets/table", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), getSstTicketsTable);

/**
 * @swagger
 * /sst-tickets/user/{id}:
 *   get:
 *     summary: Obtener tickets de SST por usuario
 *     tags: [SstTickets]
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
 *         description: Lista de tickets del usuario
 *       404:
 *         description: No se encontraron tickets
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-tickets/user/:id", authenticate, authorizeRoles(ROLE_GROUPS.ALL), validarId, getSstTicketsByUserId);

/**
 * @swagger
 * /sst-tickets/{id}:
 *   get:
 *     summary: Obtener un ticket de SST por ID
 *     tags: [SstTickets]
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
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-tickets/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), validarId, getSstTicketById);

/**
 * @swagger
 * /sst-tickets:
 *   post:
 *     summary: Crear un ticket de SST
 *     tags: [SstTickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - userId
 *               - categoryId
 *               - headquartersId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               headquartersId:
 *                 type: integer
 *               locationDescription:
 *                 type: string
 *               attachmentType:
 *                 type: string
 *                 enum: [photo, document, pdf, video, other]
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-tickets", authenticate, authorizeRoles(ROLE_GROUPS.ALL), multerSstTicket.single("file"), createSstTicket);

/**
 * @swagger
 * /sst-tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket de SST
 *     tags: [SstTickets]
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
 *         description: Ticket actualizado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/sst-tickets/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_MANAGEMENT), validarId, updateSstTicket);

/**
 * @swagger
 * /sst-tickets/{id}:
 *   delete:
 *     summary: Eliminar un ticket de SST
 *     tags: [SstTickets]
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
 *         description: Ticket eliminado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/sst-tickets/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_ADMIN), validarId, deleteSstTicket);

export default router;
