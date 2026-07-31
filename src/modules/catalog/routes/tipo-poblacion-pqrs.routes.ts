import { Router } from "express";
import { getAllPqrsPopulationTypes } from "../controllers/tipo-poblacion-pqrs.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /pqrs-population-types:
 *   get:
 *     summary: Obtiene todos los tipos de población de PQRSDF activos
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de población de PQRSDF
 */
router.get("/pqrs-population-types", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), getAllPqrsPopulationTypes);

export default router;
