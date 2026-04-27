import { Router } from "express";
import { createSoporte, deleteSoporte, getAllSorportes, getSoporteById, updateSoporte } from "../controllers/soportes.controller";
import { generateSoporteAccessToken, serveSecureSoporte } from "../controllers/soportes-secure.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { upload } from "@core/middlewares/multer-support.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { fileAccessRateLimit } from "@core/middlewares/file-rate-limit.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

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
router.get("/soportes", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.AUXILIAR]), getAllSorportes);

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
router.get("/soportes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.AUXILIAR]), validarId, getSoporteById);

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
router.post("/soportes", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA, ROLE_IDS.COORDINADOR]), upload.single('file'), createSoporte);

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
router.put("/soportes/:id", authenticate, authorizeRoles(ROLE_GROUPS.AUDIT), upload.single('file'), validarId, updateSoporte);

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
router.delete("/soportes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteSoporte);

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
router.post("/soportes/:id/access-token", fileAccessRateLimit, authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.CALIDAD, ROLE_IDS.AUXILIAR, ROLE_IDS.COORDINADOR, ROLE_IDS.RADICADOR, ROLE_IDS.SIAU, ROLE_IDS.CONTRATACION, ROLE_IDS.MEDICO, ROLE_IDS.JEFE, ROLE_IDS.CIRUGIA, ROLE_IDS.PARAMEDICO, ROLE_IDS.SOPORTE, ROLE_IDS.RRHH, ROLE_IDS.ENFERMERIA, ROLE_IDS.COORDINADORA_ENFERMERIA]), validarId, generateSoporteAccessToken);

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