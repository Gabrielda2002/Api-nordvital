import { Router } from "express";
import { getAllMaterials } from "../controllers/materiales.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";

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
router.get('/materiales', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllMaterials);

export default router;