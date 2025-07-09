import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllObjetiveDemandInduced, getObjetiveDemandInducedByName } from "../controllers/objetivo-demanda-inducida.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ObjetivoDemandaInducida:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del objetivo de demanda inducida
 *         name:
 *           type: string
 *           description: Nombre del objetivo de demanda inducida
 */

/**
 * @swagger
 * /objetivo/demanda-inducida:
 *   get:
 *     summary: Obtiene todos los objetivos de demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Objetivos Demanda Inducida]
 *     responses:
 *       200:
 *         description: Lista de objetivos de demanda inducida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ObjetivoDemandaInducida'
 *       404:
 *         description: No se encontraron objetivos de demanda inducida
 */
router.get('/objetivo/demanda-inducida', authenticate, authorizeRoles(['1']), getAllObjetiveDemandInduced);

/**
 * @swagger
 * /objetivo/demanda-inducida/buscar:
 *   post:
 *     summary: Busca objetivos de demanda inducida por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Objetivos Demanda Inducida]
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
 *                 description: Nombre del objetivo a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Objetivos de demanda inducida encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ObjetivoDemandaInducida'
 *       404:
 *         description: No se encontraron objetivos de demanda inducida
 */
router.post('/objetivo/demanda-inducida/buscar', authenticate, authorizeRoles(['1']), getObjetiveDemandInducedByName);

export default router;