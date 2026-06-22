import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
import {
  createProfesionales,
  getAllProfessional,
  getProfesionalByName,
  updateProfessional,
} from "../controllers/profesionales.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";

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
 * /professional:
 *   get:
 *     summary: Obtiene todos los profesionales
 *     security:
 *       - bearerAuth: []
 *     tags: [Profesionales]
 *     responses:
 *       200:
 *         description: Lista de profesionales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profesional'
 *       404:
 *         description: No se encontraron profesionales
 */
router.get(
  '',
  authenticate, 
  authorizeRoles([ROLE_IDS.ADMINISTRADOR]),
  getAllProfessional
)

/**
 * @swagger
 * /professional/buscar:
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
  "/buscar",
  authenticate,
  authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA]),
  getProfesionalByName
);

/**
 * @swagger
 * /professional:
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
  "",
  authenticate,
  authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA]),
  createProfesionales
);

/**
 * @swagger
 * /professional/{id}:
 *   put:
 *     summary: Actualiza un profesional
 *     security:
 *       - bearerAuth: []
 *     tags: [Profesionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesional
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
 *       200:
 *         description: Profesional actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profesional'
 *       400:
 *         description: Profesional no encontrado o error de validación
 */
router.put(
  "/:id",
  authenticate,
  authorizeRoles([ROLE_IDS.ADMINISTRADOR]),
  validarId,
updateProfessional
);

export default router;
