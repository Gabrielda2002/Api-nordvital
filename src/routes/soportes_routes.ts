import { Router } from "express";
import { createSoporte, deleteSoporte, getAllSorportes, getSoporteById, updateSoporte } from "../controllers/soportes.controller";
import { validarId } from "../middlewares/validar-id";
import { upload } from "../middlewares/multer-config-radicacion";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /soportes:
 *   get:
 *     summary: Obtiene todos los soportes
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de soportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Soporte'
 *       404:
 *         description: No hay soportes registrados
 */
router.get("/soportes", authenticate, authorizeRoles(['1', '2','3', '5']), getAllSorportes);

/**
 * @swagger
 * /soportes/{id}:
 *   get:
 *     summary: Obtiene un soporte por ID
 *     tags: [Soportes]
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
 *         description: Soporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soporte'
 *       404:
 *         description: Soporte no encontrado
 */
router.get("/soportes/:id", authenticate, authorizeRoles(['1', '2','3', '5']), validarId, getSoporteById);

/**
 * @swagger
 * /soportes:
 *   post:
 *     summary: Crea un nuevo soporte
 *     tags: [Soportes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Soporte creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soporte'
 *       400:
 *         description: Error en los datos enviados
 *       409:
 *         description: El soporte ya existe
 */
router.post("/soportes", authenticate, authorizeRoles(['1', '3','10', '15', '6']), upload.single('file'), createSoporte);

/**
 * @swagger
 * /soportes/{id}:
 *   put:
 *     summary: Actualiza un soporte
 *     tags: [Soportes]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Soporte actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soporte'
 *       404:
 *         description: Soporte no encontrado
 */
router.put("/soportes/:id", authenticate, authorizeRoles(['1', '2','3']), upload.single('file'), validarId, updateSoporte);

/**
 * @swagger
 * /soportes/{id}:
 *   delete:
 *     summary: Elimina un soporte
 *     tags: [Soportes]
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
 *         description: Soporte eliminado
 *       404:
 *         description: Soporte no encontrado
 */
router.delete("/soportes/:id", authenticate, authorizeRoles(['1']), validarId, deleteSoporte);

export default router;