import { Router } from "express";
import { create, getAllAssetTypes, update } from "../controllers/tipo-activo.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";
import { validarId } from "@core/middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoActivo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del tipo de activo
 *         name:
 *           type: string
 *           description: Nombre del tipo de activo
 */

/**
 * @swagger
 * /tipo-activo:
 *   get:
 *     summary: Obtiene todos los tipos de activo
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Activo]
 *     responses:
 *       200:
 *         description: Lista de tipos de activo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoActivo'
 *       404:
 *         description: No se encontraron tipos de activo
 */
router.get('/tipo-activo', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllAssetTypes);

/**
 * @swagger
 * /type-active:
 *   post:
 *     summary: Crea un tipo de activo
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Activo]
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
 *                 description: Nombre del tipo de activo
 *     responses:
 *       200:
 *         description: Tipo de activo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoActivo'
 *       409:
 *         description: El tipo de activo ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/type-active', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /type-active/{id}:
 *   put:
 *     summary: Actualiza un tipo de activo
 *     security:
 *       - bearerAuth: []
 *     tags: [Tipos Activo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de activo
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
 *                 description: Nombre del tipo de activo
 *     responses:
 *       200:
 *         description: Tipo de activo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoActivo'
 *       404:
 *         description: Tipo de activo no encontrado
 *       400:
 *         description: Error de validación
 */
router.put('/type-active/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]),validarId, update);

export default router;