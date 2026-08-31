import { Router } from "express";
import { getAllAttentionServices } from "../controllers/servicio-atencion.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /attention-services:
 *   get:
 *     summary: Obtiene todos los servicios de atención activos
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios de atención
 */
router.get("/attention-services", authenticate, authorizeRoles(ROLE_GROUPS.SIAU), getAllAttentionServices);

export default router;
