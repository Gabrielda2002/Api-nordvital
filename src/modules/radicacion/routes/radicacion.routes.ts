import { Router } from "express";
import { authorizeRadicacion, createRequestService, getRadicacionByPatient, getRadicaciones, getRadicacionesAudit, getSurgeries } from "../controllers";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import {upload} from "@core/middlewares/multer-support.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { getDepartmentUser } from "@core/middlewares/get-department-user.middleware";


const router = Router(); 

/**
 * @swagger
 * /radicacion/audit:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtienr las radicaciones por auditar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de radicaciones por auditar
 *       404:
 *         description: No hay radicaciones por auditar
 */
router.get('/audit', authenticate, authorizeRoles(['1','3', '2']),getDepartmentUser, getRadicacionesAudit);

/**
 * @swagger
 * /radicacion/all:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtiene las radicaciones auditadas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de radicaciones auditadas
 */
router.get('/all', authenticate, authorizeRoles(['1','3']),getDepartmentUser, getRadicaciones);

/**
 * @swagger
 * /autorizar-radicado/{id}:
 *   put:
 *     tags:
 *       - Radicación
 *     summary: actualiza el estado de una radicación (auditado)
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
 *               - auditora
 *               - fechaAuditoria
 *               - justificacion
 *             properties:
 *               auditora:
 *                 type: string
 *               fechaAuditoria:
 *                 type: string
 *                 format: date
 *               justificacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Radicación autorizada exitosamente
 *       404:
 *         description: Radicación no encontrada
 */
router.put('/:id',authenticate, authorizeRoles(['1','3']), validarId, authorizeRadicacion);

/**
 * @swagger
 * /radicaciones/surgeries:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtiene las radicaciones de cirugías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cirugías
 *       404:
 *        description: No hay radicaciones de cirugías
 */
router.get('/surgeries',authenticate, authorizeRoles(['1', '10', '3', '15', '2']), getSurgeries);

/**
 * @swagger
 * /radicaciones/doc-patient:
 *   post:
 *     tags:
 *       - Radicación
 *     summary: Busca radicaciones por número de documento del paciente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *             properties:
 *               documento:
 *                 type: string
 *                 description: Número de documento del paciente
 *     responses:
 *       200:
 *         description: Lista de radicaciones encontradas para el documento
 *       400:
 *         description: Documento es requerido
 *       404:
 *         description: No se encontraron radicaciones para ese documento
 */
router.post('/doc-patient',authenticate, authorizeRoles(['1', '10', '3', '15', '6', '2']), getDepartmentUser, getRadicacionByPatient); 

/**
 * @swagger
 * /radicaciones:
 *   post:
 *     tags:
 *       - Radicación
 *     summary: Crea una nueva solicitud de servicio con datos del paciente, CUPS y archivo de soporte
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - orderDate
 *               - place
 *               - ipsRemitente
 *               - profetional
 *               - specialty
 *               - groupServices
 *               - radicador
 *               - typeServices
 *               - idPatient
 *               - idDiagnostico
 *               - items
 *               - file
 *             properties:
 *               orderDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la orden
 *               place:
 *                 type: integer
 *                 description: ID del lugar de radicación
 *               ipsRemitente:
 *                 type: integer
 *                 description: ID de la IPS remitente
 *               profetional:
 *                 type: integer
 *                 description: ID del profesional
 *               specialty:
 *                 type: integer
 *                 description: ID de la especialidad
 *               groupServices:
 *                 type: integer
 *                 description: ID del grupo de servicios
 *               radicador:
 *                 type: integer
 *                 description: ID del usuario radicador
 *               typeServices:
 *                 type: integer
 *                 description: ID del tipo de servicio
 *               idPatient:
 *                 type: integer
 *                 description: ID del paciente
 *               idDiagnostico:
 *                 type: integer
 *                 description: ID del diagnóstico
 *               landline:
 *                 type: string
 *                 description: Teléfono fijo del paciente
 *               phoneNumber:
 *                 type: string
 *                 description: Número de teléfono celular del paciente
 *               phoneNumber2:
 *                 type: string
 *                 description: Segundo número de teléfono del paciente
 *               address:
 *                 type: string
 *                 description: Dirección del paciente
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del paciente
 *               items:
 *                 type: string
 *                 description: JSON string con array de CUPS (code, description, quantity)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de soporte para la solicitud
 *     responses:
 *       200:
 *         description: Solicitud de servicio creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requestService:
 *                   type: object
 *                   description: Datos de la radicación creada
 *                 cupsToInsert:
 *                   type: array
 *                   description: Lista de CUPS creados
 *                   items:
 *                     type: object
 *       400:
 *         description: Error en la validación de datos o archivo requerido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authenticate, authorizeRoles(['1', '10', '3', '15', '6']), upload.single('file'), createRequestService);

export default router;