import { Router } from "express";
import { create, getAllAreaTypes, update } from "../controllers/tipo-area.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoArea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del tipo de área
 *         name:
 *           type: string
 *           description: Nombre del tipo de área
 */

/**
 * @swagger
 * /tipo-area:
 *   get:
 *     summary: Obtiene todos los tipos de área
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Área]
 *     responses:
 *       200:
 *         description: Lista de tipos de área
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoArea'
 *       404:
 *         description: No se encontraron tipos de área
 */
router.get('/tipo-area', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllAreaTypes);

/**
 * @swagger
 * /type-area:
 *   post:
 *     summary: Crea un tipo de área
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Área]
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
 *                 description: Nombre del tipo de área
 *     responses:
 *       200:
 *         description: Tipo de área creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoArea'
 *       409:
 *         description: El tipo de área ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/type-area', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /type-area/{id}:
 *   put:
 *     summary: Actualiza un tipo de área
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Área]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de área
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
 *                 description: Nombre del tipo de área
 *     responses:
 *       200:
 *         description: Tipo de área actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoArea'
 *       400:
 *         description: Tipo de área no encontrado o error de validación
 */
router.put('/type-area/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), update);

export default router;