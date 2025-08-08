import { Router } from "express";
import { auditorRadicados, autorizarRadicado, buscarRadicadoPorDocumento, cirugiasTable, createRadicado, createRequestService, deleteRadicado, getAllRadicacion, getCupsEstadisticasPorMes, getRadicacionById, registrosUltimosTresMeses, tablaPorAuditar, updateGroupServices, updateRadicado } from "../controllers/radicacion.controller";
import { validarId } from "../middlewares/validar-id";
import {upload} from "../middlewares/multer-config-radicacion";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { getDepartmentUser } from "../middlewares/get-department-user_middleware";


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
router.get('/auditoria-table', authenticate, authorizeRoles(['1','3']),getDepartmentUser, tablaPorAuditar);

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
router.get('/tabla-cirugias',authenticate, authorizeRoles(['1', '10', '3', '15']), cirugiasTable);

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
router.post('/radicado-doc-patient',authenticate, authorizeRoles(['1', '10', '3', '15', '6']), getDepartmentUser ,buscarRadicadoPorDocumento); 

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

router.put('/update-group-services/:id' ,authenticate, authorizeRoles(['1', '15']), validarId, updateGroupServices);

router.post('/request/service', authenticate, authorizeRoles(['1', '15']), upload.single('file'), createRequestService);

export default router;