import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllResultCalls, getResultCallByName } from "../controllers/resultado-llamada.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ResultadoLlamada:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del resultado de llamada
 *         name:
 *           type: string
 *           description: Nombre del resultado de llamada
 */

/**
 * @swagger
 * /resultado/demanda-inducida:
 *   get:
 *     summary: Obtiene todos los resultados de llamada para demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Resultados Llamada]
 *     responses:
 *       200:
 *         description: Lista de resultados de llamada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResultadoLlamada'
 *       404:
 *         description: No se encontraron resultados de llamada
 */
router.get("/resultado/demanda-inducida", authenticate, authorizeRoles(['1']), getAllResultCalls);

/**
 * @swagger
 * /resultado/demanda-inducida/buscar:
 *   post:
 *     summary: Busca resultados de llamada por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Resultados Llamada]
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
 *                 description: Nombre del resultado a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Resultados de llamada encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResultadoLlamada'
 *       404:
 *         description: No se encontraron resultados de llamada
 */
router.post("/resultado/demanda-inducida/buscar", authenticate, authorizeRoles(['1', '19', '20']), getResultCallByName);

export default router;