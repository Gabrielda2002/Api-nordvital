import { Router } from "express";
import { getAllPqrsAreas } from "../controllers/area-pqrs.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /pqrs-areas:
 *   get:
 *     summary: Obtiene todas las áreas de PQRSDF activas
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de áreas de PQRSDF
 */
router.get("/pqrs-areas", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), getAllPqrsAreas);

export default router;
