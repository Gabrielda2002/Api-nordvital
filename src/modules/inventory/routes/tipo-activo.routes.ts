import { Router } from "express";
import { getAllAssetTypes } from "../controllers/tipo-activo.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";

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
router.get('/tipo-activo', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllAssetTypes);

export default router;