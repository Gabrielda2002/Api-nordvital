import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
import {
  getAllAreaEps,
  getAreaEpsByName,
} from "../controllers/area-eps.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AreaEps:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del área EPS
 *         name:
 *           type: string
 *           description: Nombre del área EPS
 */

/**
 * @swagger
 * /area-eps/demanda-inducida:
 *   get:
 *     summary: Obtiene todas las áreas EPS para demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Area EPS]
 *     responses:
 *       200:
 *         description: Lista de áreas EPS
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaEps'
 *       404:
 *         description: Area EPS no encontrada
 */
router.get(
  "/area-eps/demanda-inducida",
  authenticate,
  authorizeRoles([ROLE_IDS.ADMINISTRADOR]),
  getAllAreaEps
);

/**
 * @swagger
 * /area-eps/demanda-inducida/buscar:
 *   post:
 *     summary: Busca áreas EPS por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Area EPS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del área EPS a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Áreas EPS encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaEps'
 *       404:
 *         description: Area EPS no encontrada
 */
router.post(
  "/area-eps/demanda-inducida/buscar",
  authenticate,
  authorizeRoles(ROLE_GROUPS.ADMIN_NURSING),
  getAreaEpsByName
);

export default router;
