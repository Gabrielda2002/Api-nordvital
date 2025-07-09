import { Router } from "express";
import { getAllStatusIVGeneral } from "../controllers/estado-iv-general_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     EstadoIvGeneral:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del estado de inventario general
 *         name:
 *           type: string
 *           description: Nombre del estado de inventario general
 */

/**
 * @swagger
 * /estado/iv-general:
 *   get:
 *     summary: Obtiene todos los estados de inventario general
 *     security:
 *       - bearerAuth: []
 *     tags: [Estados Inventario General]
 *     responses:
 *       200:
 *         description: Lista de estados de inventario general
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstadoIvGeneral'
 *       404:
 *         description: No se encontraron estados
 */
router.get('/estado/iv-general', authenticate, authorizeRoles(['1', '6', '4']), getAllStatusIVGeneral);

export default router;