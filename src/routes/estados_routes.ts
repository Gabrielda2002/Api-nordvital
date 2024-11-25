import { Router } from "express";
import { createEstados, deleteEstados, getAllEstados, getEstadosById, updateEstados } from "../controllers/estados_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del estado
 *         name:
 *           type: string
 *           description: Nombre del estado
 *       required:
 *         - name
 */

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Obtiene todos los estados
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estado'
 */
router.get("/estados", authenticate, authorizeRoles(['1', '2']), getAllEstados);

/**
 * @swagger
 * /estados/{id}:
 *   get:
 *     summary: Obtiene un estado por ID
 *     tags: [Estados]
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
 *         description: Estado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estado'
 *       404:
 *         description: Estado no encontrado
 */
router.get("/estados/:id", authenticate, authorizeRoles(['1', '2']), validarId, getEstadosById);

/**
 * @swagger
 * /estados:
 *   post:
 *     summary: Crea un nuevo estado
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Estado creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/estados", authenticate, authorizeRoles(['1', '2']), createEstados);

/**
 * @swagger
 * /estados/{id}:
 *   put:
 *     summary: Actualiza un estado
 *     tags: [Estados]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Estado no encontrado
 */
router.put("/estados/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateEstados);

/**
 * @swagger
 * /estados/{id}:
 *   delete:
 *     summary: Elimina un estado
 *     tags: [Estados]
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
 *         description: Estado eliminado
 *       404:
 *         description: Estado no encontrado
 */
router.delete("/estados/:id", authenticate, authorizeRoles(['1']), validarId, deleteEstados);

export default router;