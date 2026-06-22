import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";
import { create, getAllClassifications, update } from "../controllers/clasificacion.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Clasificacion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la clasificación
 *         name:
 *           type: string
 *           description: Nombre de la clasificación
 */

/**
 * @swagger
 * /clasificaciones:
 *   get:
 *     summary: Obtiene todas las clasificaciones
 *     security:
 *       - bearerAuth: []
 *     tags: [Clasificaciones]
 *     responses:
 *       200:
 *         description: Lista de clasificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clasificacion'
 *       404:
 *         description: No se encontraron clasificaciones
 */
router.get('/clasificaciones', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllClassifications);

/**
 * @swagger
 * /clasificacion:
 *   post:
 *     summary: Crea una clasificación
 *     security:
 *       - bearerAuth: []
 *     tags: [Clasificaciones]
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
 *                 description: Nombre de la clasificación
 *     responses:
 *       200:
 *         description: Clasificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clasificacion'
 *       409:
 *         description: La clasificación ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/clasificacion', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /clasificacion/{id}:
 *   put:
 *     summary: Actualiza una clasificación
 *     security:
 *       - bearerAuth: []
 *     tags: [Clasificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la clasificación
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
 *                 description: Nombre de la clasificación
 *     responses:
 *       200:
 *         description: Clasificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clasificacion'
 *       404:
 *         description: Clasificación no encontrada
 *       400:
 *         description: Error de validación
 */
router.put('/clasificacion/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, update);

export default router;