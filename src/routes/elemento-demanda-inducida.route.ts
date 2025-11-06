import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { getAllElementDemandInduced, getElementDemandInducedByName } from "../controllers/elemento-demanda-inducida.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ElementoDemandaInducida:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del elemento de demanda inducida
 *         name:
 *           type: string
 *           description: Nombre del elemento de demanda inducida
 */

/**
 * @swagger
 * /elementos/demanda-inducida:
 *   get:
 *     summary: Obtiene todos los elementos de demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Elementos Demanda Inducida]
 *     responses:
 *       200:
 *         description: Lista de elementos de demanda inducida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ElementoDemandaInducida'
 *       404:
 *         description: No se encontraron elementos de demanda inducida
 */
router.get("/elementos/demanda-inducida", authenticate, authorizeRoles(['1']), getAllElementDemandInduced);

/**
 * @swagger
 * /elementos/demanda-inducida/buscar:
 *   post:
 *     summary: Busca elementos de demanda inducida por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Elementos Demanda Inducida]
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
 *                 description: Nombre del elemento a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Elementos de demanda inducida encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElementoDemandaInducida'
 *       400:
 *         description: El nombre es requerido
 *       404:
 *         description: No se encontraron elementos de demanda inducida
 */
router.post("/elementos/demanda-inducida/buscar", authenticate, authorizeRoles(['1', '19', '20', '21']), getElementDemandInducedByName);

export default router;