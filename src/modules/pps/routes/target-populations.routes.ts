import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getTargetPopulations, createTargetPopulation, updateTargetPopulation, disableTargetPopulation } from "../controllers/target-populations.controller";

const router = Router();

/**
 * @swagger
 * /pps/target-populations:
 *   get:
 *     summary: Lista la población objetivo (catálogo PPS)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: onlyActive
 *         schema:
 *           type: boolean
 *         description: Si es true, solo devuelve registros activos
 *     responses:
 *       200:
 *         description: Lista de población objetivo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsTargetPopulation'
 */
router.get("/target-populations", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getTargetPopulations);

/**
 * @swagger
 * /pps/target-populations:
 *   post:
 *     summary: Crea un registro de población objetivo
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsCatalogRequest'
 *     responses:
 *       201:
 *         description: Población objetivo creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsTargetPopulation'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe un registro con ese código
 */
router.post("/target-populations", authenticate, authorizeRoles(ROLE_GROUPS.PPS), createTargetPopulation);

/**
 * @swagger
 * /pps/target-populations/{id}:
 *   put:
 *     summary: Actualiza un registro de población objetivo
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
 *             $ref: '#/components/schemas/PpsCatalogRequest'
 *     responses:
 *       200:
 *         description: Población objetivo actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsTargetPopulation'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Registro no encontrado
 *       409:
 *         description: Ya existe un registro con ese código
 */
router.put("/target-populations/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updateTargetPopulation);

/**
 * @swagger
 * /pps/target-populations/{id}:
 *   delete:
 *     summary: Desactiva un registro de población objetivo (no se elimina físicamente)
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
 *         description: Población objetivo desactivada
 *       404:
 *         description: Registro no encontrado
 */
router.delete("/target-populations/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, disableTargetPopulation);

export default router;
