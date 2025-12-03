import { Router } from "express";
import { auditorRadicados, autorizarRadicado, buscarRadicadoPorDocumento, cirugiasTable, createRadicado, createRequestService, deleteRadicado, getAllRadicacion, getCupsEstadisticasPorMes, getRadicacionById, registrosUltimosTresMeses, tablaPorAuditar, updateGroupServices, updateRadicado } from "../controllers/radicacion.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import {upload} from "../middlewares/multer-support.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { getDepartmentUser } from "../middlewares/get-department-user.middleware";


const router = Router();

/**
 * @swagger
 * /radicacion:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtiene todas las radicaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de radicaciones
 *       401:
 *         description: No autorizado
 */
router.get('/radicacion',authenticate, authorizeRoles(['1','10', '3', '15', 6]), getAllRadicacion);

/**
 * @swagger
 * /radicacion/{id}:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtiene una radicación por ID
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
 *         description: Radicación encontrada
 *       404:
 *         description: Radicación no encontrada
 */
router.get('/radicacion/:id',authenticate, authorizeRoles(['1', '10', '3', '15']), validarId, getRadicacionById);

/**
 * @swagger
 * /radicacion:
 *   post:
 *     tags:
 *       - Radicación
 *     summary: Crea una nueva radicación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *               - idSoporte
 *               - idDiagnostico
 *             properties:
 *               orderDate:
 *                 type: string
 *                 format: date
 *               place:
 *                 type: integer
 *               ipsRemitente:
 *                 type: integer
 *               profetional:
 *                 type: string
 *               specialty:
 *                 type: integer
 *               groupServices:
 *                 type: integer
 *               radicador:
 *                 type: integer
 *               typeServices:
 *                 type: integer
 *               idPatient:
 *                 type: integer
 *               idSoporte:
 *                 type: integer
 *               idDiagnostico:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Radicación creada exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
router.post('/radicacion',authenticate, authorizeRoles(['1', '10', '3', '15', '6']), createRadicado);

/**
 * @swagger
 * /radicacion/{id}:
 *   put:
 *     tags:
 *       - Radicación
 *     summary: Actualiza una radicación por ID
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
 *               - orderDate
 *               - place
 *               - ipsRemitente
 *               - profetional
 *               - specialty
 *               - groupServices
 *               - radicador
 *               - typeServices
 *               - idPatient
 *               - idSoporte
 *               - idDiagnostico
 *             properties:
 *               orderDate:
 *                 type: string
 *                 format: date
 *               place:
 *                 type: integer
 *               ipsRemitente:
 *                 type: integer
 *               profetional:
 *                 type: string
 *               specialty:
 *                 type: integer
 *               groupServices:
 *                 type: integer
 *               radicador:
 *                 type: integer
 *               typeServices:
 *                 type: integer
 *               idPatient:
 *                 type: integer
 *               idSoporte:
 *                 type: integer
 *               idDiagnostico:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Radicación actualizada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Radicación no encontrada
 */
router.put('/radicacion/:id',authenticate, authorizeRoles(['1', '10', '3']), validarId, updateRadicado);

/**
 * @swagger
 * /radicacion/{id}:
 *   delete:
 *     tags:
 *       - Radicación
 *     summary: Elimina una radicación por ID
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
 *         description: Radicación eliminada exitosamente
 *       404:
 *         description: Radicación no encontrada
 */
router.delete('/radicacion/:id',authenticate, authorizeRoles(['1']), validarId, deleteRadicado);

// router.get('/radicacion-table',authenticate, authorizeRoles(['1', '10', '3', '15']),  mostrarTabla);

/**
 * @swagger
 * /auditoria-table:
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
router.get('/auditoria-table', authenticate, authorizeRoles(['1','3', '2']),getDepartmentUser, tablaPorAuditar);

/**
 * @swagger
 * /auditoria-auditados:
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
router.get('/auditoria-auditados', authenticate, authorizeRoles(['1','3']),getDepartmentUser , auditorRadicados);

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
router.put('/autorizar-radicado/:id',authenticate, authorizeRoles(['1','3']), validarId, autorizarRadicado);

/**
 * @swagger
 * /tabla-cirugias:
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
router.get('/tabla-cirugias',authenticate, authorizeRoles(['1', '10', '3', '15', '2']), cirugiasTable);

/**
 * @swagger
 * /radicacion-month:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtiene estadísticas de radicaciones de los últimos 3 meses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas mensuales de radicaciones
 */
router.get("/radicacion-month", authenticate, authorizeRoles(['1', '10', '3', '15']), registrosUltimosTresMeses);

/**
 * @swagger
 * /radicado-doc-patient:
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
router.post('/radicado-doc-patient',authenticate, authorizeRoles(['1', '10', '3', '15', '6', '2']), getDepartmentUser ,buscarRadicadoPorDocumento); 

/**
 * @swagger
 * /estadistica-cups-estado:
 *   get:
 *     tags:
 *       - Radicación
 *     summary: Obtiene estadísticas de radicaciones por estado de los CUPS
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de radicaciones por estado de los CUPS
 */
router.get('/estadistica-cups-estado', authenticate, authorizeRoles(['1', '10', '3','6', '15']), getCupsEstadisticasPorMes);

/**
 * @swagger
 * /update-group-services/{id}:
 *   put:
 *     tags:
 *       - Radicación
 *     summary: Actualiza el grupo de servicios de una radicación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la radicación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupServices
 *             properties:
 *               groupServices:
 *                 type: integer
 *                 description: ID del nuevo grupo de servicios
 *     responses:
 *       200:
 *         description: Grupo de servicios actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Radicacion updated"
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Radicación no encontrada
 */
router.put('/update-group-services/:id' ,authenticate, authorizeRoles(['1', '15', '3']), validarId, updateGroupServices);

/**
 * @swagger
 * /request/service:
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
router.post('/request/service', authenticate, authorizeRoles(['1', '10', '3', '15', '6']), upload.single('file'), createRequestService);

export default router;