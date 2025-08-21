import { Router } from "express";
import { createSoporte, deleteSoporte, getAllSorportes, getSoporteById, updateSoporte } from "../controllers/soportes.controller";
import { generateSoporteAccessToken, serveSecureSoporte } from "../controllers/soportes-secure.controller";
import { validarId } from "../middlewares/validar-id";
import { upload } from "../middlewares/multer-config-radicacion";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { fileAccessRateLimit } from "../middlewares/file-rate-limit";

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

/**
 * @swagger
 * /soportes/{id}/access-token:
 *   post:
 *     summary: Genera un token temporal para acceso seguro a un soporte
 *     security:
 *       - bearerAuth: []
 *     tags: [Soportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del soporte
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [VIEW, DOWNLOAD]
 *         description: Acción a realizar (VIEW para visualizar, DOWNLOAD para descargar)
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *       400:
 *         description: Parámetros inválidos
 *       404:
 *         description: Soporte no encontrado
 */
router.post("/soportes/:id/access-token", fileAccessRateLimit, authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']), validarId, generateSoporteAccessToken);

/**
 * @swagger
 * /secure-soporte/{token}:
 *   get:
 *     summary: Accede a un soporte de forma segura usando un token temporal
 *     tags: [Soportes]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT temporal generado previamente
 *     responses:
 *       200:
 *         description: Soporte servido exitosamente
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Soporte no encontrado
 */
router.get("/secure-soporte/:token", serveSecureSoporte);

export default router;