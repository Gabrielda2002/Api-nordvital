import { Router } from "express";
import { getAllPqrsGeneralReasons } from "../controllers/motivo-general-pqrs.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /pqrs-general-reasons:
 *   get:
 *     summary: Obtiene todos los motivos generales de PQRSDF activos
 *     tags: [Catálogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de motivos generales de PQRSDF
 */
router.get("/pqrs-general-reasons", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), getAllPqrsGeneralReasons);

export default router;
