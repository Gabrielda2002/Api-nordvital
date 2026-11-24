import { Router } from "express";
import { TurnosPublicController } from "../controllers/turnos-public.controller";

const router = Router();

/**
 * @swagger
 * /turnos/sedes/{slug}/config:
 *   get:
 *     summary: Obtener configuración pública de una sede para turnos
 *     tags: [Turnos - Público]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuración de sede, servicios activos asignados a esa sede (vacío si no hay asignaciones) y documentTypes activos
 *       404:
 *         description: Sede no encontrada o no habilitada
 */
router.get("/sedes/:slug/config", TurnosPublicController.getSedeConfig);

/**
 * @swagger
 * /turnos/pacientes/verificar:
 *   post:
 *     summary: Verificar existencia de un paciente por número de documento
 *     tags: [Turnos - Público]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [documentNumber, documentType]
 *             properties:
 *               documentNumber:
 *                 type: string
 *               documentType:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: exists, patient (fullName, documentNumber, phoneNumber, documentTypeId) y activeTurn (ticketToken, ticketCode, status, serviceName, headquarterName) o null
 */
router.post("/pacientes/verificar", TurnosPublicController.verificarPaciente);

/**
 * @swagger
 * /turnos/ticket:
 *   post:
 *     summary: Emitir un nuevo ticket digital previa validación de geolocalización
 *     description: Si la identidad no está registrada, crea un paciente activo con documento, nombre y celular. Correo, dirección, convenio e IPS primaria quedan pendientes como null; no modifica el perfil de pacientes existentes.
 *     tags: [Turnos - Público]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, serviceId, classification, documentNumber, documentTypeId, name, phoneNumber]
 *             properties:
 *               slug:
 *                 type: string
 *               serviceId:
 *                 type: integer
 *               classification:
 *                 type: string
 *                 enum: [ASIGNACION_CITAS, CONFIRMACION_CITAS, TRAMITES_ADMINISTRATIVOS]
 *               documentNumber:
 *                 type: string
 *               documentTypeId:
 *                 type: integer
 *                 minimum: 1
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [GENERAL, PRIORITARIO]
 *                 default: GENERAL
 *               userLatitude:
 *                 type: number
 *                 description: Obligatoria salvo omisión explícita en desarrollo
 *               userLongitude:
 *                 type: number
 *                 description: Obligatoria salvo omisión explícita en desarrollo
 *               skipGeolocation:
 *                 type: boolean
 *                 default: false
 *                 description: Solo true con NODE_ENV=development; se rechaza en otros entornos
 *     responses:
 *       201:
 *         description: Ticket emitido con su clasificación; aheadCount y estimatedWaitMinutes consideran la cola de la sede, con prioritarios primero. estimatedWaitMinutes es null si no hay asesor activo para el servicio.
 *       403:
 *         description: Ubicación fuera del radio permitido u omisión solicitada fuera de desarrollo
 *       400:
 *         description: Sede sin servicios configurados o servicio no asignado a la sede
 *       409:
 *         description: Paciente con turno activo del día en cualquier sede o servicio; incluye activeTicket recuperable
 */
router.post("/ticket", TurnosPublicController.emitirTicket);

/**
 * @swagger
 * /turnos/ticket/{token}:
 *   get:
 *     summary: Consultar estado en vivo del ticket para el celular del paciente
 *     tags: [Turnos - Público]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posición en la cola de la sede con prioritarios primero y cobertura de servicios; estimatedWaitMinutes es null si no hay asesor activo para el servicio.
 *       404:
 *         description: Ticket no encontrado
 */
router.get("/ticket/:token", TurnosPublicController.getTicketEstado);

/**
 * @swagger
 * /turnos/ticket/{token}/encuesta:
 *   post:
 *     summary: Registrar encuesta NPS de satisfacción post-atención
 *     tags: [Turnos - Público]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Encuesta registrada con éxito
 *       400:
 *         description: Turno no finalizado o calificación inválida
 *       409:
 *         description: Encuesta ya registrada previamente
 */
router.post("/ticket/:token/encuesta", TurnosPublicController.registrarEncuesta);

/**
 * @swagger
 * /turnos/ticket/{token}/cancelar:
 *   post:
 *     summary: Cancelar voluntariamente un turno por parte del paciente
 *     tags: [Turnos - Público]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Turno cancelado con éxito
 *       404:
 *         description: Ticket no encontrado
 *       409:
 *         description: Estado distinto de PENDIENTE o LLAMADO; incluye conflicto con inicio de atención
 */
router.post("/ticket/:token/cancelar", TurnosPublicController.cancelarTicket);

/**
 * @swagger
 * /turnos/tv/{slug}/estado:
 *   get:
 *     summary: Obtener turnos activos, próximos y llamados recientes para la pantalla de sala (TV)
 *     tags: [Turnos - Público]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turnos llamados/en atención, hasta cinco próximos pendientes en orden cronológico de visualización e historial reciente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recentCalls:
 *                   type: array
 *                   maxItems: 5
 *                   description: Últimos turnos distintos llamados hoy (America/Bogota) en la sede, del más reciente al más antiguo. Un rellamado actualiza la entrada. Vacío si no hubo llamados.
 *                   items:
 *                     type: object
 *                     required: [ticketCode, moduloCode, moduloName, calledAt]
 *                     properties:
 *                       ticketCode:
 *                         type: string
 *                       moduloCode:
 *                         type: string
 *                         description: Código del módulo desde el que se llamó; vacío si ya no está disponible.
 *                       moduloName:
 *                         type: string
 *                         description: Nombre del módulo desde el que se llamó; vacío si ya no está disponible.
 *                       calledAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora del último llamado. La TV calcula el tiempo transcurrido.
 *       404:
 *         description: Sede no encontrada o no habilitada
 */
router.get("/tv/:slug/estado", TurnosPublicController.getTvEstado);

export default router;
