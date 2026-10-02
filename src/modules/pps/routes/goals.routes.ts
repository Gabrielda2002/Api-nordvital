import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getGoals, createGoal, updateGoal, disableGoal } from "../controllers/goals.controller";

const router = Router();

/**
 * @swagger
 * /pps/goals:
 *   get:
 *     summary: Lista las metas (catálogo PPS)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actionLineId
 *         schema:
 *           type: integer
 *         description: Filtra las metas por línea de acción
 *       - in: query
 *         name: onlyActive
 *         schema:
 *           type: boolean
 *         description: Si es true, solo devuelve registros activos
 *     responses:
 *       200:
 *         description: Lista de metas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsGoal'
 */
router.get("/goals", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getGoals);

/**
 * @swagger
 * /pps/goals:
 *   post:
 *     summary: Crea una meta asociada a una línea de acción
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsGoalRequest'
 *     responses:
 *       201:
 *         description: Meta creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsGoal'
 *       400:
 *         description: Datos inválidos o línea de acción inexistente
 *       409:
 *         description: Ya existe una meta con ese código en la línea de acción
 */
router.post("/goals", authenticate, authorizeRoles(ROLE_GROUPS.PPS), createGoal);

/**
 * @swagger
 * /pps/goals/{id}:
 *   put:
 *     summary: Actualiza una meta
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
 *             $ref: '#/components/schemas/PpsGoalRequest'
 *     responses:
 *       200:
 *         description: Meta actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsGoal'
 *       400:
 *         description: Datos inválidos o línea de acción inexistente
 *       404:
 *         description: Meta no encontrada
 *       409:
 *         description: Ya existe una meta con ese código en la línea de acción
 */
router.put("/goals/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updateGoal);

/**
 * @swagger
 * /pps/goals/{id}:
 *   delete:
 *     summary: Desactiva una meta (no se elimina físicamente)
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
 *         description: Meta desactivada
 *       404:
 *         description: Meta no encontrada
 */
router.delete("/goals/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, disableGoal);

export default router;
