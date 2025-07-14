import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllSummaryActivity, getSummaryActivityByName } from "../controllers/resumen-seguimiento-actividad.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ResumenSeguimientoActividad:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del resumen de seguimiento de actividad
 *         name:
 *           type: string
 *           description: Nombre del resumen de seguimiento de actividad
 */

/**
 * @swagger
 * /resumen/demanda-inducida:
 *   get:
 *     summary: Obtiene todos los resúmenes de seguimiento de actividad para demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Resúmenes Seguimiento Actividad]
 *     responses:
 *       200:
 *         description: Lista de resúmenes de seguimiento de actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResumenSeguimientoActividad'
 *       404:
 *         description: No se encontraron resúmenes de seguimiento de actividad
 */
router.get("/resumen/demanda-inducida", authenticate, authorizeRoles(['1']), getAllSummaryActivity);

/**
 * @swagger
 * /resumen/demanda-inducida/buscar:
 *   post:
 *     summary: Busca resúmenes de seguimiento de actividad por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Resúmenes Seguimiento Actividad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del resumen a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Resúmenes de seguimiento de actividad encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResumenSeguimientoActividad'
 *       404:
 *         description: No se encontraron resúmenes de seguimiento de actividad
 */
router.post("/resumen/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getSummaryActivityByName);

export default router;