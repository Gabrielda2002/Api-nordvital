import { Router } from "express";
import { getAllMaterials } from "../controllers/materiales_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del material
 *         name:
 *           type: string
 *           description: Nombre del material
 */

/**
 * @swagger
 * /materiales:
 *   get:
 *     summary: Obtiene todos los materiales
 *     security:
 *       - bearerAuth: []
 *     tags: [Materiales]
 *     responses:
 *       200:
 *         description: Lista de materiales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       404:
 *         description: No se encontraron materiales
 */
router.get('/materiales', authenticate, authorizeRoles(['1', '6','4']), getAllMaterials);

export default router;