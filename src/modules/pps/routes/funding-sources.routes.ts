import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getFundingSources, createFundingSource, updateFundingSource, disableFundingSource } from "../controllers/funding-sources.controller";

const router = Router();

/**
 * @swagger
 * /pps/funding-sources:
 *   get:
 *     summary: Lista las fuentes de recursos (catálogo PPS)
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
 *         description: Lista de fuentes de recursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsFundingSource'
 */
router.get("/funding-sources", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getFundingSources);

/**
 * @swagger
 * /pps/funding-sources:
 *   post:
 *     summary: Crea una fuente de recursos
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
 *         description: Fuente de recursos creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsFundingSource'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe una fuente de recursos con ese código
 */
router.post("/funding-sources", authenticate, authorizeRoles(ROLE_GROUPS.PPS), createFundingSource);

/**
 * @swagger
 * /pps/funding-sources/{id}:
 *   put:
 *     summary: Actualiza una fuente de recursos
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
 *         description: Fuente de recursos actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsFundingSource'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Fuente de recursos no encontrada
 *       409:
 *         description: Ya existe una fuente de recursos con ese código
 */
router.put("/funding-sources/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updateFundingSource);

/**
 * @swagger
 * /pps/funding-sources/{id}:
 *   delete:
 *     summary: Desactiva una fuente de recursos (no se elimina físicamente)
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
 *         description: Fuente de recursos desactivada
 *       404:
 *         description: Fuente de recursos no encontrada
 */
router.delete("/funding-sources/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, disableFundingSource);

export default router;
