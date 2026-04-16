import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { multerInfrastructureTicket } from "@core/middlewares/multer-infrastructure-ticket.middleware";
import {
    getAllInfrastructureTickets,
    getInfrastructureTicketById,
    createInfrastructureTicket,
    updateInfrastructureTicket,
    deleteInfrastructureTicket,
    getInfrastructureTicketsTable,
    getInfrastructureTicketsByUserId,
} from "../controllers/infrastructure-tickets.controller";

const ALL_ROLES = ['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
const INFRA_MANAGEMENT = ['1','22','23'];
const INFRA_ADMIN = ['1','22'];

const router = Router();

/**
 * @swagger
 * /infrastructure-tickets:
 *   get:
 *     summary: Obtener todos los tickets de infraestructura
 *     tags: [InfrastructureTickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los tickets de infraestructura
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infrastructure-tickets", authenticate, authorizeRoles(INFRA_MANAGEMENT), getAllInfrastructureTickets);

/**
 * @swagger
 * /infrastructure-tickets/table:
 *   get:
 *     summary: Obtener tabla de tickets de infraestructura con relaciones
 *     tags: [InfrastructureTickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tabla de tickets de infraestructura formateada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infrastructure-tickets/table", authenticate, authorizeRoles(INFRA_MANAGEMENT), getInfrastructureTicketsTable);

/**
 * @swagger
 * /infrastructure-tickets/user/{id}:
 *   get:
 *     summary: Obtener tickets de infraestructura por ID de usuario
 *     tags: [InfrastructureTickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Tickets del usuario
 *       404:
 *         description: No se encontraron tickets
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infrastructure-tickets/user/:id", authenticate, authorizeRoles(ALL_ROLES), validarId, getInfrastructureTicketsByUserId);

/**
 * @swagger
 * /infrastructure-tickets/{id}:
 *   get:
 *     summary: Obtener un ticket de infraestructura por ID
 *     tags: [InfrastructureTickets]
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
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infrastructure-tickets/:id", authenticate, authorizeRoles(INFRA_MANAGEMENT), validarId, getInfrastructureTicketById);

/**
 * @swagger
 * /infrastructure-tickets:
 *   post:
 *     summary: Crear un nuevo ticket de infraestructura
 *     tags: [InfrastructureTickets]
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
 *               - sedeId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               sedeId:
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
router.post("/infrastructure-tickets", authenticate, authorizeRoles(ALL_ROLES), multerInfrastructureTicket.single("file"), createInfrastructureTicket);

/**
 * @swagger
 * /infrastructure-tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket de infraestructura
 *     tags: [InfrastructureTickets]
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
router.put("/infrastructure-tickets/:id", authenticate, authorizeRoles(INFRA_MANAGEMENT), validarId, updateInfrastructureTicket);

/**
 * @swagger
 * /infrastructure-tickets/{id}:
 *   delete:
 *     summary: Eliminar un ticket de infraestructura
 *     tags: [InfrastructureTickets]
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
router.delete("/infrastructure-tickets/:id", authenticate, authorizeRoles(INFRA_ADMIN), validarId, deleteInfrastructureTicket);

export default router;
