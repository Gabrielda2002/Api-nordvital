import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createActiveBrake, deleteActiveBrake, getActiveBrakeById, getAllActiveBrakes, updateActiveBrake } from "../controllers/pausas-activas_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /active-brakes:
 *   get:
 *     summary: Obtiene todas las pausas activas
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pausas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PausasActivas'
 *       401:
 *         description: No autorizado
 */
router.get("/active-brakes", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), getAllActiveBrakes)

/**
 * @swagger
 * /active-brakes/{id}:
 *   get:
 *     summary: Obtiene una pausa activa por ID
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pausa activa
 *     responses:
 *       200:
 *         description: Pausa activa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PausasActivas'
 *       404:
 *         description: Pausa activa no encontrada
 */
router.get("/active-brakes/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), validarId, getActiveBrakeById)

/**
 * @swagger
 * /active-brakes:
 *   post:
 *     summary: Crea una nueva pausa activa
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observation
 *               - userId
 *             properties:
 *               observation:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pausa activa creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PausasActivas'
 *       400:
 *         description: Error en la validación
 */
router.post("/active-brakes", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), createActiveBrake)

/**
 * @swagger
 * /active-brakes/{id}:
 *   put:
 *     summary: Actualiza una pausa activa
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observation
 *               - userId
 *             properties:
 *               observation:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pausa activa actualizada
 *       404:
 *         description: Pausa activa no encontrada
 */
router.put("/active-brakes/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), validarId, updateActiveBrake)

/**
 * @swagger
 * /active-brakes/{id}:
 *   delete:
 *     summary: Elimina una pausa activa
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pausa activa eliminada
 *       404:
 *         description: Pausa activa no encontrada
 */
router.delete("/active-brakes/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), validarId, deleteActiveBrake)

export default router;