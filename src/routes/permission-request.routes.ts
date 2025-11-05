import { Router } from "express";
import { actOnPermissionStep, cancelPermissionRequest, createPermissionRequest, generatePermissionAttachmentAccessToken, getPermissionRequestById, listAllRequestsByUser, listPermissionRequests, serveSecurePermissionAttachment } from "../controllers/permission.controller";
import { authenticate } from "../middlewares/auth";
import { uploadAttachmentsPermissions } from "../middlewares/multer-attechments-permissions";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { fileAccessRateLimit } from "../middlewares/file-rate-limit";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swaggerp
 * /permisos/requests:
 *   post:
 *     tags:
 *       - Permisos
 *     summary: Crea una nueva solicitud de permiso
 *     description: |
 *       Crea una solicitud de permiso según la categoría y políticas configuradas. Valida:
 *       - Fechas y horas (granularity)
 *       - Antigüedad del empleado (solo para VACACIONES)
 *       - Documentos requeridos (INCAPACIDAD, VACACIONES)
 *       - No solapamiento si la política lo prohíbe
 *       - Topes por solicitud y por año
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - granularity
 *               - startDate
 *             properties:
 *               category:
 *                 type: string
 *                 description: Categoría del permiso (VACACIONES, INCAPACIDAD, CALAMIDAD, etc.)
 *               granularity:
 *                 type: string
 *                 enum: [FULL_DAY, HALF_DAY, HOURS]
 *                 description: Granularidad del permiso
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del permiso
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del permiso (requerido para FULL_DAY)
 *               startTime:
 *                 type: string
 *                 description: Hora de inicio (requerido para HOURS)
 *               endTime:
 *                 type: string
 *                 description: Hora de fin (requerido para HOURS)
 *               nonRemunerated:
 *                 type: boolean
 *                 description: Si el permiso es no remunerado
 *               compensationTime:
 *                 type: string
 *                 description: Tiempo de compensación
 *               notes:
 *                 type: string
 *                 description: Notas adicionales sobre la solicitud
 *               requesterId:
 *                 type: integer
 *                 description: ID del solicitante (opcional si está autenticado)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo adjunto (requerido para INCAPACIDAD y VACACIONES)
 *     responses:
 *       201:
 *         description: Solicitud de permiso creada exitosamente
 *       400:
 *         description: Error en la validación de datos o políticas
 *       401:
 *         description: No autorizado
 */
router.post("/permisos/requests", authenticate, uploadAttachmentsPermissions.single("file"), createPermissionRequest);

/**
 * @swagger
 * /permisos/requests/{id}:
 *   get:
 *     tags:
 *       - Permisos
 *     summary: Obtiene una solicitud de permiso por ID
 *     description: Devuelve la solicitud con sus pasos de aprobación y adjuntos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud de permiso
 *     responses:
 *       200:
 *         description: Solicitud de permiso encontrada
 *       404:
 *         description: Solicitud no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/permisos/requests/:id", authenticate, getPermissionRequestById);

/**
 * @swagger
 * /permissions/requests/{id}/steps/{stepId}/actions:
 *   post:
 *     tags:
 *       - Permisos
 *     summary: Ejecuta una acción en un paso de aprobación
 *     description: |
 *       Permite aprobar, rechazar o marcar como visto un paso de la solicitud.
 *       Autorización:
 *       - JEFE: solo el usuario asignado en el paso
 *       - RRHH: cualquier usuario con rol RRHH
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud de permiso
 *       - in: path
 *         name: stepId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paso de aprobación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [PENDIENTE, APROBADO, RECHAZADO, VISTO]
 *                 description: Acción a ejecutar en el paso
 *               comment:
 *                 type: string
 *                 description: Comentario opcional sobre la acción
 *               actorUserId:
 *                 type: integer
 *                 description: ID del usuario que ejecuta la acción (opcional si está autenticado)
 *     responses:
 *       200:
 *         description: Acción ejecutada exitosamente
 *       400:
 *         description: Acción inválida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: El usuario no tiene permisos para esta acción
 */
router.post("/permissions/requests/:id/steps/:stepId/actions", authenticate,authorizeRoles(['1', '6', '20', '18']) , actOnPermissionStep);

/**
 * @swagger
 * /list/requests:
 *   get:
 *     tags:
 *       - Permisos
 *     summary: Lista solicitudes de permiso pendientes
 *     description: |
 *       Lista las solicitudes de permiso según el rol del usuario:
 *       - Para jefes: solicitudes donde son aprobadores
 *       - Para RRHH: todas las solicitudes pendientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes de permiso
 *       401:
 *         description: No autorizado
 */
router.get('/list/requests', authenticate, authorizeRoles(['1', '18', '6', '20']), listPermissionRequests);

/**
 * @swagger
 * /list/requests/user:
 *   get:
 *     tags:
 *       - Permisos
 *     summary: Lista todas las solicitudes del usuario autenticado
 *     description: Obtiene todas las solicitudes de permiso creadas por el usuario actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/list/requests/user', authenticate, listAllRequestsByUser);

/**
 * @swagger
 * /attachments/{id}/access-token:
 *   post:
 *     tags:
 *       - Permisos
 *     summary: Genera un token temporal para acceder a un adjunto
 *     description: Crea un token de acceso temporal (15 minutos) para visualizar o descargar un adjunto de forma segura
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del adjunto
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [VIEW, DOWNLOAD]
 *         description: Tipo de acción (VIEW para visualizar, DOWNLOAD para descargar)
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de acceso temporal
 *                 expiresIn:
 *                   type: integer
 *                   description: Tiempo de expiración en segundos
 *                 url:
 *                   type: string
 *                   description: URL para acceder al archivo
 *                 action:
 *                   type: string
 *                   description: Tipo de acción permitida
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Adjunto no encontrado
 *       429:
 *         description: Demasiadas solicitudes (rate limit)
 */
router.post('/attachments/:id/access-token', fileAccessRateLimit, authenticate, validarId, generatePermissionAttachmentAccessToken);

/**
 * @swagger
 * /secure-attachments/{token}:
 *   get:
 *     tags:
 *       - Permisos
 *     summary: Accede a un adjunto mediante token temporal
 *     description: Permite visualizar o descargar un adjunto utilizando un token temporal previamente generado
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de acceso temporal
 *     responses:
 *       200:
 *         description: Archivo encontrado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Archivo no encontrado
 */
router.get('/secure-attachments/:token', serveSecurePermissionAttachment);

/**
 * @swagger
 * /permission/requests/{id}/cancel:
 *   put:
 *     tags:
 *       - Permisos
 *     summary: Cancela una solicitud de permiso
 *     description: |
 *       Permite al usuario cancelar su propia solicitud de permiso.
 *       Solo se pueden cancelar solicitudes que estén en estado PENDIENTE o EN_REVISION.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud de permiso a cancelar
 *     responses:
 *       200:
 *         description: Solicitud cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud cancelada exitosamente
 *                 request:
 *                   type: object
 *                   description: Datos de la solicitud cancelada
 *       400:
 *         description: La solicitud no puede ser cancelada (estado inválido)
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para cancelar esta solicitud
 *       404:
 *         description: Solicitud no encontrada
 */
router.put("/permission/requests/:id/cancel", authenticate, authorizeRoles(['1', '6', '20', '18']), validarId, cancelPermissionRequest);

export default router;
