import { Router } from "express";
import { create, getAllMaterials, update } from "../controllers/materiales.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";
import { validarId } from "@core/middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del material
 *         name:
 *           type: string
 *           description: Nombre del material
 */

/**
 * @swagger
 * /materiales:
 *   get:
 *     summary: Obtiene todos los materiales
 *     security:
 *       - bearerAuth: []
 *     tags: [Materiales]
 *     responses:
 *       200:
 *         description: Lista de materiales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       404:
 *         description: No se encontraron materiales
 */
router.get('/materiales', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllMaterials);

/**
 * @swagger
 * /material:
 *   post:
 *     summary: Crea un material
 *     security:
 *       - bearerAuth: []
 *     tags: [Materiales]
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
 *                 description: Nombre del material
 *     responses:
 *       200:
 *         description: Material creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       409:
 *         description: El material ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/material', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /material/{id}:
 *   put:
 *     summary: Actualiza un material
 *     security:
 *       - bearerAuth: []
 *     tags: [Materiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del material
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
 *                 description: Nombre del material
 *     responses:
 *       200:
 *         description: Material actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       400:
 *         description: Material no encontrado o error de validación
 */
router.put('/material/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, update);

export default router;