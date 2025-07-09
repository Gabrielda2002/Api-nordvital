import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import {
  createProfesionales,
  getProfesionalByName,
} from "../controllers/profesionales.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profesional:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del profesional
 *         name:
 *           type: string
 *           description: Nombre del profesional
 */

/**
 * @swagger
 * /profesionales/buscar:
 *   post:
 *     summary: Busca profesionales por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Profesionales]
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
 *                 description: Nombre del profesional a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Profesionales encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profesional'
 *       404:
 *         description: No se encontraron profesionales
 */
router.post(
  "/profesionales/buscar",
  authenticate,
  authorizeRoles(["1", "3", "10", "15", "6"]),
  getProfesionalByName
);

/**
 * @swagger
 * /profesionales:
 *   post:
 *     summary: Crea un nuevo profesional
 *     security:
 *       - bearerAuth: []
 *     tags: [Profesionales]
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
 *                 description: Nombre del profesional
 *     responses:
 *       201:
 *         description: Profesional creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profesional'
 *       400:
 *         description: El profesional ya existe o error de validación
 */
router.post(
  "/profesionales",
  authenticate,
  authorizeRoles(["1", "3", "10", "15", "6"]),
  createProfesionales
);

export default router;
