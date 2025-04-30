import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createNotaTecnica, deleteNotaTecnica, getAllNotaTecnica, getNotaTecnicaById, updateNotaTecnica, updateNotaTecnicaStatusFromExcel } from "../controllers/notas-tecnicas_controller";
import { validarId } from "../middlewares/validar-id";
import { uploadXlsx } from "../middlewares/upload-xlsx-PS";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notas Técnicas
 *   description: Endpoints para la gestión de notas técnicas
 */

/**
 * @swagger
 * /notas-tecnicas:
 *   get:
 *     summary: Obtener todas las notas técnicas
 *     tags: [Notas Técnicas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas técnicas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NotaTecnica'
 */
router.get('/notas-tecnicas', authenticate, authorizeRoles(['1']), getAllNotaTecnica);

/**
 * @swagger
 * /notas-tecnicas/{id}:
 *   get:
 *     summary: Obtener una nota técnica por ID
 *     tags: [Notas Técnicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la nota técnica
 *     responses:
 *       200:
 *         description: Nota técnica obtenida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotaTecnica'
 */
router.get('/notas-tecnicas/:id', authenticate, authorizeRoles(['1']), validarId, getNotaTecnicaById);

/**
 * @swagger
 * /notas-tecnicas:
 *   post:
 *     summary: Crear una nueva nota técnica
 *     tags: [Notas Técnicas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotaTecnica'
 *     responses:
 *       201:
 *         description: Nota técnica creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotaTecnica'
 */
router.post('/notas-tecnicas', authenticate, authorizeRoles(['1']), createNotaTecnica);

/**
 * @swagger
 * /notas-tecnicas/{id}:
 *   put:
 *     summary: Actualizar una nota técnica por ID
 *     tags: [Notas Técnicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la nota técnica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotaTecnica'
 *     responses:
 *       200:
 *         description: Nota técnica actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotaTecnica'
 */
router.put('/notas-tecnicas/:id', authenticate, authorizeRoles(['1']), validarId, updateNotaTecnica);

/**
 * @swagger
 * /notas-tecnicas/{id}:
 *   delete:
 *     summary: Eliminar una nota técnica por ID
 *     tags: [Notas Técnicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la nota técnica
 *     responses:
 *       200:
 *         description: Nota técnica eliminada
 */
router.delete('/notas-tecnicas/:id', authenticate, authorizeRoles(['1']), validarId, deleteNotaTecnica);

router.put('/notas/tecnicas/status', authenticate, authorizeRoles(['1']), uploadXlsx ,updateNotaTecnicaStatusFromExcel);

export default router;