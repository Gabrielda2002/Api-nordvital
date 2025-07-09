import { Router } from "express";
import { getAllAreaTypes } from "../controllers/tipo-area_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoArea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del tipo de área
 *         name:
 *           type: string
 *           description: Nombre del tipo de área
 */

/**
 * @swagger
 * /tipo-area:
 *   get:
 *     summary: Obtiene todos los tipos de área
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Área]
 *     responses:
 *       200:
 *         description: Lista de tipos de área
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoArea'
 *       404:
 *         description: No se encontraron tipos de área
 */
router.get('/tipo-area', authenticate, authorizeRoles(['1','6','4']), getAllAreaTypes);

export default router;