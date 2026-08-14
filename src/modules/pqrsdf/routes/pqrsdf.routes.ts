import { Router } from "express";
import {
    createPqrsdf,
    deletePqrsdf,
    getAllPqrsdf,
    getPqrsdf,
    updatePqrsdf,
} from "../controllers/pqrsdf.controller";
import {
    createPqrsdfComment,
    generatePqrsdfCommentAttachmentToken,
    getPqrsdfComments,
    serveSecurePqrsdfCommentAttachment,
} from "../controllers/pqrsdf-comments.controller";
import { multerPqrsdfComment } from "@core/middlewares/multer-pqrsdf-comment.middleware";
import { fileAccessRateLimit } from "@core/middlewares/file-rate-limit.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /pqrsdf:
 *   get:
 *     summary: Obtiene todas las PQRSDF
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filtro por fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filtro por fecha de fin (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtro por estado (ABIERTO, EN_GESTION, CERRADO)
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *         description: Filtro por clasificación
 *       - in: query
 *         name: instance
 *         schema:
 *           type: string
 *         description: Filtro por instancia
 *       - in: query
 *         name: patientDocument
 *         schema:
 *           type: string
 *         description: Filtro por documento del paciente
 *       - in: query
 *         name: originAreaId
 *         schema:
 *           type: integer
 *         description: Filtro por ID de área de origen
 *     responses:
 *       200:
 *         description: Lista de PQRSDF
 */
router.get("/pqrsdf", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), getAllPqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}:
 *   get:
 *     summary: Obtiene una PQRSDF por ID
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la PQRSDF
 *     responses:
 *       200:
 *         description: PQRSDF encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 improvementActionDetails:
 *                   type: string
 *                   nullable: true
 *                   description: Detalle de la acción de mejora
 *                 statusHistory:
 *                   type: array
 *                   description: Historial cronológico de estados (solo en el detalle)
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: [ABIERTO, EN_GESTION, CERRADO]
 *                       note:
 *                         type: string
 *                         nullable: true
 *                       actor:
 *                         type: string
 *                         nullable: true
 *                         description: Nombre del usuario que realizó la transición
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: PQRSDF no encontrada
 */
router.get("/pqrsdf/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, getPqrsdf);

/**
 * @swagger
 * /pqrsdf:
 *   post:
 *     summary: Crea una nueva PQRSDF
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Pqrsdf'
 *               - type: object
 *                 properties:
 *                   note:
 *                     type: string
 *                     description: Nota opcional de la creación (se registra en el historial de estados)
 *                   improvementAction:
 *                     type: boolean
 *                     description: Acción de mejora
 *                   improvementActionDetails:
 *                     type: string
 *                     description: Detalle de la acción de mejora (obligatorio cuando improvementAction=true)
 *     responses:
 *       201:
 *         description: PQRSDF creada
 *       400:
 *         description: Error de validación
 */
router.post("/pqrsdf", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), createPqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}:
 *   put:
 *     summary: Actualiza una PQRSDF
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Pqrsdf'
 *               - type: object
 *                 properties:
 *                   note:
 *                     type: string
 *                     description: Nota obligatoria cuando cambia el estado (se registra en el historial)
 *                   improvementActionDetails:
 *                     type: string
 *                     description: Detalle de la acción de mejora (obligatorio cuando improvementAction=true)
 *     responses:
 *       200:
 *         description: PQRSDF actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: PQRSDF no encontrada
 */
router.put("/pqrsdf/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, updatePqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}:
 *   delete:
 *     summary: Elimina una PQRSDF
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: PQRSDF eliminada
 *       404:
 *         description: PQRSDF no encontrada
 */
router.delete("/pqrsdf/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, deletePqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}/comments:
 *   get:
 *     summary: Obtiene todos los comentarios de una PQRSDF
 *     tags: [PQRSDF Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la PQRSDF
 *     responses:
 *       200:
 *         description: Lista de comentarios con autor y adjunto
 *       404:
 *         description: PQRSDF no encontrada
 */
router.get("/pqrsdf/:id/comments", authenticate, authorizeRoles(ROLE_GROUPS.PQRSDF_COLLABORATORS), validarId, getPqrsdfComments);

/**
 * @swagger
 * /pqrsdf/{id}/comments:
 *   post:
 *     summary: Crea un comentario en una PQRSDF con un archivo adjunto opcional
 *     tags: [PQRSDF Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la PQRSDF
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Contenido del comentario (obligatorio)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo adjunto opcional (PDF o imagen, máx. 3 MB)
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: PQRSDF no encontrada
 */
router.post("/pqrsdf/:id/comments", authenticate, authorizeRoles(ROLE_GROUPS.PQRSDF_COLLABORATORS), validarId, multerPqrsdfComment.single("file"), createPqrsdfComment);

/**
 * @swagger
 * /pqrsdf/comments/{attachmentId}/access-token:
 *   post:
 *     summary: Genera un token temporal para acceso seguro al adjunto de un comentario
 *     tags: [PQRSDF Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del adjunto del comentario
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
 *         description: Adjunto no encontrado
 */
router.post("/pqrsdf/comments/:id/access-token", fileAccessRateLimit, authenticate, authorizeRoles(ROLE_GROUPS.PQRSDF_COLLABORATORS), validarId, generatePqrsdfCommentAttachmentToken);

/**
 * @swagger
 * /secure-pqrsdf-attachment/{token}:
 *   get:
 *     summary: Accede al adjunto de un comentario de forma segura usando un token temporal
 *     tags: [PQRSDF Comments]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT temporal generado previamente
 *     responses:
 *       200:
 *         description: Adjunto servido exitosamente
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Adjunto no encontrado
 */
router.get("/secure-pqrsdf-attachment/:token", serveSecurePqrsdfCommentAttachment);

export default router;