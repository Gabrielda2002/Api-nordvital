import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/eventos.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();



/**
 * @swagger
 * /events:
 *   get:
 *     summary: Obtiene todos los eventos
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 */
router.get("", authenticate, authorizeRoles(ROLE_GROUPS.ALL), getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obtiene un evento por ID
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Evento no encontrado
 */
router.get("/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Crea un nuevo evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       200:
 *         description: Evento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         description: Datos inválidos
 */
router.post("", authenticate, authorizeRoles([...ROLE_GROUPS.SST_MANAGEMENT, ROLE_IDS.RRHH]), createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Actualiza un evento existente
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       200:
 *         description: Evento actualizado
 *       404:
 *         description: Evento no encontrado
 */
router.put("/:id", authenticate, authorizeRoles([...ROLE_GROUPS.SST_MANAGEMENT, ROLE_IDS.RRHH]), validarId, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Elimina un evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento eliminado
 *       404:
 *         description: Evento no encontrado
 */
router.delete("/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteEvent);

export default router;
