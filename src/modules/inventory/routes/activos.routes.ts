import { Router } from "express";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
import { create, getAllByAssetId, update } from "../controllers/activos.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Activo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del activo
 *         name:
 *           type: string
 *           description: Nombre del activo
 *         classificationId:
 *           type: integer
 *           description: ID de la clasificación asociada
 */

/**
 * @swagger
 * /activos/{id}:
 *   get:
 *     summary: Obtiene activos por ID de clasificación
 *     security:
 *       - bearerAuth: []
 *     tags: [Activos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la clasificación
 *     responses:
 *       200:
 *         description: Lista de activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activo'
 *       404:
 *         description: No se encontraron activos
 */
router.get('/activos/:id', authenticate, authorizeRoles(ROLE_GROUPS.COORDINADORES),validarId ,getAllByAssetId);

/**
 * @swagger
 * /activos:
 *   post:
 *     summary: Crea un activo
 *     security:
 *       - bearerAuth: []
 *     tags: [Activos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - classificationId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del activo
 *               classificationId:
 *                 type: integer
 *                 description: ID de la clasificación asociada
 *     responses:
 *       200:
 *         description: Activo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activo'
 *       409:
 *         description: El activo ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/activos', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /activos/{id}:
 *   put:
 *     summary: Actualiza un activo
 *     security:
 *       - bearerAuth: []
 *     tags: [Activos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del activo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - classificationId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del activo
 *               classificationId:
 *                 type: integer
 *                 description: ID de la clasificación asociada
 *     responses:
 *       200:
 *         description: Activo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activo'
 *       400:
 *         description: Activo no encontrado o error de validación
 */
router.put('/activos/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, update);

export default router;