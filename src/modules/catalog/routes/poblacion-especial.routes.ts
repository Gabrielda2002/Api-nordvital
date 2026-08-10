import { Router } from "express";
import { getAllSpecialPopulations } from "../controllers/poblacion-especial.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /special-populations:
 *   get:
 *     summary: Obtiene todas las poblaciones especiales activas
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de poblaciones especiales
*/
router.get("/special-populations", authenticate, authorizeRoles(ROLE_GROUPS.SIAU), getAllSpecialPopulations);

export default router;
