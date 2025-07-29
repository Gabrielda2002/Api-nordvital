import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import {
  getAllTypeDemandInduced,
  getTypeDemandInducedByName,
} from "../controllers/tipo-demanda-inducida.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoDemandaInducida:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del tipo de demanda inducida
 *         name:
 *           type: string
 *           description: Nombre del tipo de demanda inducida
 */

/**
 * @swagger
 * /tipo/demanda-inducida:
 *   get:
 *     summary: Obtiene todos los tipos de demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Demanda Inducida]
 *     responses:
 *       200:
 *         description: Lista de tipos de demanda inducida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoDemandaInducida'
 *       404:
 *         description: No se encontraron tipos de demanda inducida
 */
router.get(
  "/tipo/demanda-inducida",
  authenticate,
  authorizeRoles(["1"]),
  getAllTypeDemandInduced
);

/**
 * @swagger
 * /tipo/demanda-inducida/buscar:
 *   post:
 *     summary: Busca tipos de demanda inducida por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Demanda Inducida]
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
 *                 description: Nombre del tipo a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Tipos de demanda inducida encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoDemandaInducida'
 *       404:
 *         description: No se encontraron tipos de demanda inducida
 */
router.post(
  "/tipo/demanda-inducida/buscar",
  authenticate,
  authorizeRoles(["1", '19', '20']),
  getTypeDemandInducedByName
);

export default router;