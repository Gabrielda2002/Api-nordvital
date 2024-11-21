import { Router } from "express";
import { createConvenio, deleteConvenio, getAllConvenio, getConvenioById, updateConvenio, updateStatusConvenio } from "../controllers/convenio-controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Convenio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del convenio
 *         name:
 *           type: string
 *           description: Nombre del convenio
 *         status:
 *           type: boolean
 *           description: Estado del convenio
 *       required:
 *         - name
 */

/**
 * @swagger
 * /convenio:
 *   get:
 *     summary: Obtiene todos los convenios
 *     tags: [Convenios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de convenios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Convenio'
 */
router.get('/convenio', authenticate, authorizeRoles(['1', '3', '10', '15']), getAllConvenio);

/**
 * @swagger
 * /convenio/{id}:
 *   get:
 *     summary: Obtiene un convenio por ID
 *     tags: [Convenios]
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
 *         description: Convenio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Convenio'
 *       404:
 *         description: Convenio no encontrado
 */
router.get('/convenio/:id', authenticate, authorizeRoles(['1', '2']), validarId, getConvenioById);

/**
 * @swagger
 * /convenio:
 *   post:
 *     summary: Crea un nuevo convenio
 *     tags: [Convenios]
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
 *       201:
 *         description: Convenio creado
 *       400:
 *         description: Error en la validación
 */
router.post('/convenio', authenticate, authorizeRoles(['1', '2']), createConvenio);

/**
 * @swagger
 * /convenio/{id}:
 *   put:
 *     summary: Actualiza un convenio
 *     tags: [Convenios]
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
 *         description: Convenio actualizado
 *       404:
 *         description: Convenio no encontrado
 */
router.put('/convenio/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateConvenio);

/**
 * @swagger
 * /convenio/{id}:
 *   delete:
 *     summary: Elimina un convenio
 *     tags: [Convenios]
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
 *         description: Convenio eliminado
 *       404:
 *         description: Convenio no encontrado
 */
router.delete('/convenio/:id', authenticate, authorizeRoles(['1', '2']), validarId, deleteConvenio);

/**
 * @swagger
 * /update-status-convenio/{id}:
 *   put:
 *     summary: Actualiza el estado de un convenio
 *     tags: [Convenios]
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
 *               status:
 *                 type: string
 *                 enum: ['0', '1']
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado del convenio actualizado
 *       404:
 *         description: Convenio no encontrado
 */
router.put("/update-status-convenio/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateStatusConvenio);

export default router;