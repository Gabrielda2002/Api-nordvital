import { Router } from "express";
import { createEstadosSeguimiento, deleteEstadosSeguimiento, getEstadosSeguimiento, getEstadosSeguimientos, updateEstadosSeguimiento } from "../controllers/estados-seguimiento.controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

/**
 * @swagger
 * /estados-seguimientos:
 *   get:
 *     summary: Obtiene todos los estados de seguimiento
 *     tags: [Estados Seguimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados de seguimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   status:
 *                     type: boolean
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Forbidden - No tiene permisos
 */
router.get("/estados-seguimientos", authenticate, authorizeRoles(['1', '2']), getEstadosSeguimientos);

/**
 * @swagger
 * /estados-seguimientos/{id}:
 *   get:
 *     summary: Obtiene un estado de seguimiento por ID
 *     tags: [Estados Seguimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado de seguimiento
 *     responses:
 *       200:
 *         description: Estado de seguimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       404:
 *         description: Estado de seguimiento no encontrado
 */
router.get("/estados-seguimientos/:id", validarId, authenticate, authorizeRoles(['1', '2']), getEstadosSeguimiento);

/**
 * @swagger
 * /estados-seguimientos:
 *   post:
 *     summary: Crea un nuevo estado de seguimiento
 *     tags: [Estados Seguimientos]
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
 *                 required: true
 *     responses:
 *       200:
 *         description: Estado de seguimiento creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/estados-seguimientos", authenticate, authorizeRoles(['1', '2']), createEstadosSeguimiento);

/**
 * @swagger
 * /estados-seguimientos/{id}:
 *   put:
 *     summary: Actualiza un estado de seguimiento
 *     tags: [Estados Seguimientos]
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
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado de seguimiento actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Estado de seguimiento no encontrado
 */
router.put("/estados-seguimientos/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateEstadosSeguimiento);

/**
 * @swagger
 * /estados-seguimientos/{id}:
 *   delete:
 *     summary: Elimina un estado de seguimiento
 *     tags: [Estados Seguimientos]
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
 *         description: Estado de seguimiento eliminado
 *       404:
 *         description: Estado de seguimiento no encontrado
 */
router.delete("/estados-seguimientos/:id", authenticate, authorizeRoles(['1']), validarId, deleteEstadosSeguimiento);

export default router;