import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getAllClassifications } from "../controllers/clasificacion.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Clasificacion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la clasificación
 *         name:
 *           type: string
 *           description: Nombre de la clasificación
 */

/**
 * @swagger
 * /clasificaciones:
 *   get:
 *     summary: Obtiene todas las clasificaciones
 *     security:
 *       - bearerAuth: []
 *     tags: [Clasificaciones]
 *     responses:
 *       200:
 *         description: Lista de clasificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clasificacion'
 *       404:
 *         description: No se encontraron clasificaciones
 */
router.get('/clasificaciones', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllClassifications);

export default router;