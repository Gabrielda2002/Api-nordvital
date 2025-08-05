import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/eventos.controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /eventos:
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
router.get("/eventos", authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18', '19', '20', '21']), getAllEvents)

/**
 * @swagger
 * /evento/{id}:
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
router.get("/evento/:id", authenticate, authorizeRoles(['1']),validarId, getEventById )

/**
 * @swagger
 * /eventos:
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
router.post("/eventos", authenticate, authorizeRoles(['1', '18']), createEvent )

/**
 * @swagger
 * /eventos/{id}:
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
router.put("/eventos/:id", authenticate, authorizeRoles(['1', '18']),validarId, updateEvent )

/**
 * @swagger
 * /eventos/{id}:
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
router.delete("/eventos/:id", authenticate, authorizeRoles(['1']),validarId, deleteEvent )

export default router;