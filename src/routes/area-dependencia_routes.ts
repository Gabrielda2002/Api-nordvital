import { Router } from "express";
import { getAllAreaDependency } from "../controllers/area-dependencia_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AreaDependencia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del área dependencia
 *         name:
 *           type: string
 *           description: Nombre del área dependencia
 */

/**
 * @swagger
 * /area-dependencia:
 *   get:
 *     summary: Obtiene todas las áreas dependencia
 *     security:
 *       - bearerAuth: []
 *     tags: [Area Dependencia]
 *     responses:
 *       200:
 *         description: Lista de áreas dependencia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaDependencia'
 *       404:
 *         description: No se encontraron registros
 */
router.get('/area-dependencia', authenticate, authorizeRoles(['1', '6', '4']), getAllAreaDependency);

export default router;