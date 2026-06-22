import { Router } from "express";
import { create, getAllAreaDependency, update } from "../controllers/area-dependencia.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AreaDependencia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del área dependencia
 *         name:
 *           type: string
 *           description: Nombre del área dependencia
 */

/**
 * @swagger
 * /area-dependencia:
 *   get:
 *     summary: Obtiene todas las áreas dependencia
 *     security:
 *       - bearerAuth: []
 *     tags: [Area Dependencia]
 *     responses:
 *       200:
 *         description: Lista de áreas dependencia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaDependencia'
 *       404:
 *         description: No se encontraron registros
 */
router.get('/area-dependencia', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllAreaDependency);

/**
 * @swagger
 * /area-dependencia:
 *   post:
 *     summary: Crea un área dependencia
 *     security:
 *       - bearerAuth: []
 *     tags: [Area Dependencia]
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
 *                 description: Nombre del área dependencia
 *     responses:
 *       200:
 *         description: Área dependencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaDependencia'
 *       409:
 *         description: El área dependencia ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/area-dependencia', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /area-dependencia/{id}:
 *   put:
 *     summary: Actualiza un área dependencia
 *     security:
 *       - bearerAuth: []
 *     tags: [Area Dependencia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del área dependencia
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
 *                 description: Nombre del área dependencia
 *     responses:
 *       200:
 *         description: Área dependencia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaDependencia'
 *       400:
 *         description: Área dependencia no encontrada o error de validación
 */
router.put('/area-dependencia/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), update);

export default router;