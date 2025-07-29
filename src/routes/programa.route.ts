import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllPrograms, getProgramByName } from "../controllers/programa.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Programa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del programa
 *         name:
 *           type: string
 *           description: Nombre del programa
 */

/**
 * @swagger
 * /programas:
 *   get:
 *     summary: Obtiene todos los programas
 *     security:
 *       - bearerAuth: []
 *     tags: [Programas]
 *     responses:
 *       200:
 *         description: Lista de programas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Programa'
 *       404:
 *         description: No se encontraron programas
 */
router.get("/programas", authenticate, authorizeRoles(['1']), getAllPrograms);

/**
 * @swagger
 * /programas/buscar:
 *   post:
 *     summary: Busca programas por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Programas]
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
 *                 description: Nombre del programa a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Programas encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Programa'
 *       404:
 *         description: No se encontraron programas
 */
router.post("/programas/buscar", authenticate, authorizeRoles(['1', '19', '20']), getProgramByName);

export default router;