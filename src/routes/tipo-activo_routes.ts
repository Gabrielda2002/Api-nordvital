import { Router } from "express";
import { getAllAssetTypes } from "../controllers/tipo-activo_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoActivo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del tipo de activo
 *         name:
 *           type: string
 *           description: Nombre del tipo de activo
 */

/**
 * @swagger
 * /tipo-activo:
 *   get:
 *     summary: Obtiene todos los tipos de activo
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Activo]
 *     responses:
 *       200:
 *         description: Lista de tipos de activo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoActivo'
 *       404:
 *         description: No se encontraron tipos de activo
 */
router.get('/tipo-activo', authenticate, authorizeRoles(['1', '6', '4']), getAllAssetTypes);

export default router;