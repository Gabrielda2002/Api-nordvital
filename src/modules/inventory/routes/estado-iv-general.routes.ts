import { Router } from "express";
import { create, getAllStatusIVGeneral, update } from "../controllers/estado-iv-general.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";
import { validarId } from "@core/middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     EstadoIvGeneral:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del estado de inventario general
 *         name:
 *           type: string
 *           description: Nombre del estado de inventario general
 */

/**
 * @swagger
 * /estado/iv-general:
 *   get:
 *     summary: Obtiene todos los estados de inventario general
 *     security:
 *       - bearerAuth: []
 *     tags: [Estados Inventario General]
 *     responses:
 *       200:
 *         description: Lista de estados de inventario general
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstadoIvGeneral'
 *       404:
 *         description: No se encontraron estados
 */
router.get('/estado/iv-general', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_CATALOG), getAllStatusIVGeneral);

/**
 * @swagger
 * /status/inv-general:
 *   post:
 *     summary: Crea un estado de inventario general
 *     security:
 *       - bearerAuth: []
 *     tags: [Estados Inventario General]
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
 *                 description: Nombre del estado de inventario general
 *     responses:
 *       200:
 *         description: Estado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoIvGeneral'
 *       409:
 *         description: El estado ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/status/inv-general', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), create);

/**
 * @swagger
 * /status/inv-general/{id}:
 *   put:
 *     summary: Actualiza un estado de inventario general
 *     security:
 *       - bearerAuth: []
 *     tags: [Estados Inventario General]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de inventario general
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
 *                 description: Nombre del estado de inventario general
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoIvGeneral'
 *       400:
 *         description: Estado no encontrado o error de validación
 */
router.put('/status/inv-general/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]),validarId, update);

export default router;