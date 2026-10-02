import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getActivities, createActivity, updateActivity, disableActivity } from "../controllers/activities.controller";

const router = Router();

/**
 * @swagger
 * /pps/activities:
 *   get:
 *     summary: Lista las actividades (catálogo PPS)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: goalId
 *         schema:
 *           type: integer
 *         description: Filtra las actividades por meta
 *       - in: query
 *         name: onlyActive
 *         schema:
 *           type: boolean
 *         description: Si es true, solo devuelve registros activos
 *     responses:
 *       200:
 *         description: Lista de actividades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsActivity'
 */
router.get("/activities", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getActivities);

/**
 * @swagger
 * /pps/activities:
 *   post:
 *     summary: Crea una actividad asociada a una meta
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsActivityRequest'
 *     responses:
 *       201:
 *         description: Actividad creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsActivity'
 *       400:
 *         description: Datos inválidos o meta inexistente
 *       409:
 *         description: Ya existe una actividad con ese código en la meta
 */
router.post("/activities", authenticate, authorizeRoles(ROLE_GROUPS.PPS), createActivity);

/**
 * @swagger
 * /pps/activities/{id}:
 *   put:
 *     summary: Actualiza una actividad
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsActivityRequest'
 *     responses:
 *       200:
 *         description: Actividad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsActivity'
 *       400:
 *         description: Datos inválidos o meta inexistente
 *       404:
 *         description: Actividad no encontrada
 *       409:
 *         description: Ya existe una actividad con ese código en la meta
 */
router.put("/activities/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updateActivity);

/**
 * @swagger
 * /pps/activities/{id}:
 *   delete:
 *     summary: Desactiva una actividad (no se elimina físicamente)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad desactivada
 *       404:
 *         description: Actividad no encontrada
 */
router.delete("/activities/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, disableActivity);

export default router;
