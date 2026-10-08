import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
    getProgrammedActivities,
    createProgrammedActivity,
    updateProgrammedActivity,
    deleteProgrammedActivity,
} from "../controllers/programmed-activities.controller";

const router = Router();

/**
 * @swagger
 * /pps/periods/{id}/programmed-activities:
 *   get:
 *     summary: Lista las actividades programadas de una vigencia (incluye el seguimiento, si está completo y los campos pendientes)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la vigencia
 *     responses:
 *       200:
 *         description: Lista de actividades programadas con sede y seguimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsProgrammedActivity'
 *       404:
 *         description: Vigencia no encontrada
 */
router.get("/periods/:id/programmed-activities", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, getProgrammedActivities);

/**
 * @swagger
 * /pps/periods/{id}/programmed-activities:
 *   post:
 *     summary: Programa una actividad en una vigencia
 *     description: El territorio se deriva de los primeros 5 dígitos del código de habilitación de la sede. En modo estricto se debe enviar activityId (y opcionalmente goalId) del catálogo; en modo manual se envían los códigos y descripciones.
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la vigencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsProgrammedActivityRequest'
 *     responses:
 *       201:
 *         description: Actividad programada creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsProgrammedActivity'
 *       400:
 *         description: Datos inválidos (sede sin código de habilitación, territorio no válido, fechas fuera de la vigencia, combinación fuera del catálogo en modo estricto, etc.)
 *       404:
 *         description: Vigencia no encontrada
 */
router.post("/periods/:id/programmed-activities", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, createProgrammedActivity);

/**
 * @swagger
 * /pps/programmed-activities/{id}:
 *   put:
 *     summary: Actualiza una actividad programada (la vigencia no cambia)
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
 *             $ref: '#/components/schemas/PpsProgrammedActivityRequest'
 *     responses:
 *       200:
 *         description: Actividad programada actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsProgrammedActivity'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Actividad programada no encontrada
 */
router.put("/programmed-activities/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updateProgrammedActivity);

/**
 * @swagger
 * /pps/programmed-activities/{id}:
 *   delete:
 *     summary: Elimina una actividad programada junto con su seguimiento
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
 *         description: Actividad programada eliminada
 *       404:
 *         description: Actividad programada no encontrada
 */
router.delete("/programmed-activities/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, deleteProgrammedActivity);

export default router;
