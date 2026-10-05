import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getPeriods, getPeriod, createPeriod, updatePeriod, deletePeriod } from "../controllers/periods.controller";

const router = Router();

/**
 * @swagger
 * /pps/periods:
 *   get:
 *     summary: Lista las vigencias del PPS (ordenadas de la más reciente a la más antigua)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vigencias con la cantidad de actividades programadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsPeriod'
 */
router.get("/periods", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getPeriods);

/**
 * @swagger
 * /pps/periods/{id}:
 *   get:
 *     summary: Obtiene una vigencia por ID
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
 *         description: Vigencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsPeriod'
 *       404:
 *         description: Vigencia no encontrada
 */
router.get("/periods/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, getPeriod);

/**
 * @swagger
 * /pps/periods:
 *   post:
 *     summary: Crea una vigencia (solo puede existir una por año)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsPeriodRequest'
 *     responses:
 *       201:
 *         description: Vigencia creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsPeriod'
 *       400:
 *         description: Datos inválidos (año fuera de rango, fechas incoherentes o corte fuera de la vigencia)
 *       409:
 *         description: Ya existe una vigencia para ese año
 */
router.post("/periods", authenticate, authorizeRoles(ROLE_GROUPS.PPS), createPeriod);

/**
 * @swagger
 * /pps/periods/{id}:
 *   put:
 *     summary: Actualiza las fechas o el estado de una vigencia (el año es inmutable)
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
 *             $ref: '#/components/schemas/PpsPeriodRequest'
 *     responses:
 *       200:
 *         description: Vigencia actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsPeriod'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Vigencia no encontrada
 */
router.put("/periods/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updatePeriod);

/**
 * @swagger
 * /pps/periods/{id}:
 *   delete:
 *     summary: Elimina una vigencia junto con su programación y seguimiento
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
 *         description: Vigencia eliminada
 *       404:
 *         description: Vigencia no encontrada
 */
router.delete("/periods/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, deletePeriod);

export default router;
