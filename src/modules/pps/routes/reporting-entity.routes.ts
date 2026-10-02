import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getReportingEntity, updateReportingEntity } from "../controllers/reporting-entity.controller";

const router = Router();

/**
 * @swagger
 * /pps/reporting-entity:
 *   get:
 *     summary: Obtiene los datos de la entidad que reporta el PPS
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos de la entidad reportante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsReportingEntity'
 */
router.get("/reporting-entity", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getReportingEntity);

/**
 * @swagger
 * /pps/reporting-entity:
 *   put:
 *     summary: Actualiza los datos de la entidad reportante y los parámetros del reporte
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsReportingEntityRequest'
 *     responses:
 *       200:
 *         description: Datos actualizados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsReportingEntity'
 *       400:
 *         description: Datos inválidos
 */
router.put("/reporting-entity", authenticate, authorizeRoles(ROLE_GROUPS.PPS), updateReportingEntity);

export default router;
