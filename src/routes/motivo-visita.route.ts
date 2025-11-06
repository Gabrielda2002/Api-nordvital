import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { getAllReasonVisit, getReasonVisitByName } from "../controllers/motivo-visita.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MotivoVisita:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del motivo de visita
 *         name:
 *           type: string
 *           description: Nombre del motivo de visita
 */

/**
 * @swagger
 * /motivo-visita/demanda-inducida:
 *   get:
 *     summary: Obtiene todos los motivos de visita para demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Motivos Visita]
 *     responses:
 *       200:
 *         description: Lista de motivos de visita
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MotivoVisita'
 *       404:
 *         description: No se encontraron motivos de visita
 */
router.get("/motivo-visita/demanda-inducida", authenticate, authorizeRoles(['1']), getAllReasonVisit);

/**
 * @swagger
 * /motivo-visita/demanda-inducida/buscar:
 *   post:
 *     summary: Busca motivos de visita por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Motivos Visita]
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
 *                 description: Nombre del motivo de visita a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Motivos de visita encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MotivoVisita'
 *       404:
 *         description: No se encontraron motivos de visita
 */
router.post("/motivo-visita/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getReasonVisitByName);

export default router;