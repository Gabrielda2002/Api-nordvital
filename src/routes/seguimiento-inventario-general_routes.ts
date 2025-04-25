import { Router } from "express";
import { createInventoryTrackingGeneral, getAllInventoryTrackingGeneralByItem } from "../controllers/seguimiento-inventario-general_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /seguimuento/inventario-general/{id}:
 *   get:
 *     summary: Obtener el historial de seguimiento de un ítem del inventario general
 *     tags: [Seguimiento Inventario General]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ítem del inventario general
 *     responses:
 *       200:
 *         description: Historial de seguimiento del ítem.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SeguimientoInventarioGeneral'
 *       404:
 *         description: No se encontraron registros.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/seguimuento/inventario-general/:id', authenticate, authorizeRoles(['1']), getAllInventoryTrackingGeneralByItem);

/**
 * @swagger
 * /seguimiento/inventario-general:
 *   post:
 *     summary: Crear un nuevo registro de seguimiento para un ítem del inventario general
 *     tags: [Seguimiento Inventario General]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeguimientoInventarioGeneral'
 *     responses:
 *       201:
 *         description: Registro de seguimiento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguimientoInventarioGeneral'
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/seguimiento/inventario-general', authenticate, authorizeRoles(['1']), createInventoryTrackingGeneral);

export default router;