import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createDemandInduced, getAllDemandInduded, getEstadisticasDemandaInducida } from "../controllers/demanda-inducida.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DemandaInducida:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la demanda inducida
 *         typeDocument:
 *           type: string
 *           description: Tipo de documento del paciente
 *         document:
 *           type: string
 *           description: Número de documento del paciente
 *         dateCreated:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         elementDI:
 *           type: string
 *           description: Elemento de demanda inducida
 *         typeElementDI:
 *           type: string
 *           description: Tipo de elemento de demanda inducida
 *         objetive:
 *           type: string
 *           description: Objetivo
 *         numbersContact:
 *           type: string
 *           description: Números de contacto
 *         classification:
 *           type: string
 *           description: Clasificación
 *         perconReceive:
 *           type: string
 *           description: Persona que recibe
 *         relationshipUser:
 *           type: string
 *           description: Relación con el usuario
 *         dateCall:
 *           type: string
 *           format: date
 *           description: Fecha de llamada
 *         hourCall:
 *           type: string
 *           description: Hora de llamada
 *         textCall:
 *           type: string
 *           description: Texto de llamada
 *         areaEps:
 *           type: string
 *           description: Área EPS
 *         summaryCall:
 *           type: string
 *           description: Resumen de llamada
 *         resultCALL:
 *           type: string
 *           description: Resultado de llamada
 *         profetional:
 *           type: string
 *           description: Profesional asignado
 */

/**
 * @swagger
 * /demanda/inducida:
 *   get:
 *     summary: Obtiene todas las demandas inducidas
 *     security:
 *       - bearerAuth: []
 *     tags: [Demanda Inducida]
 *     responses:
 *       200:
 *         description: Lista de demandas inducidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DemandaInducida'
 *       404:
 *         description: No se encontraron demandas inducidas
 */
router.get("/demanda/inducida", authenticate, authorizeRoles(['1', '19', '20', '21', '2']), getAllDemandInduded);

/**
 * @swagger
 * /demanda/inducida:
 *   post:
 *     summary: Crea una nueva demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Demanda Inducida]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - elementDemand
 *               - classification
 *               - idPatient
 *               - programPerson
 *               - idUser
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del paciente
 *               phoneNumber:
 *                 type: string
 *                 description: Número de teléfono principal
 *               phoneNumber2:
 *                 type: string
 *                 description: Número de teléfono secundario
 *               address:
 *                 type: string
 *                 description: Dirección del paciente
 *               elementDemand:
 *                 type: integer
 *                 description: ID del elemento de demanda inducida
 *               typeElementDemand:
 *                 type: integer
 *                 description: ID del tipo de elemento de demanda inducida
 *               objetive:
 *                 type: integer
 *                 description: ID del objetivo
 *               contactNumbers:
 *                 type: string
 *                 description: Números de contacto
 *               classification:
 *                 type: string
 *                 description: Clasificación de la demanda
 *               acceptCall:
 *                 type: string
 *                 description: Persona que acepta la llamada
 *               relationshipUser:
 *                 type: integer
 *                 description: ID de la relación con el usuario
 *               dateCall:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la llamada
 *               hourCall:
 *                 type: string
 *                 description: Hora de la llamada
 *               textCall:
 *                 type: string
 *                 description: Texto de la llamada
 *               dificulties:
 *                 type: string
 *                 description: Dificultades de acceso
 *               areaDificulties:
 *                 type: string
 *                 description: Área de dificultades
 *               areaEps:
 *                 type: integer
 *                 description: ID del área EPS
 *               summaryCall:
 *                 type: integer
 *                 description: ID del resumen de llamada
 *               conditionUser:
 *                 type: string
 *                 description: Condición del usuario
 *               suport:
 *                 type: string
 *                 description: Soporte recuperado
 *               resultCall:
 *                 type: integer
 *                 description: ID del resultado de llamada
 *               dateSend:
 *                 type: string
 *                 format: date
 *                 description: Fecha de envío
 *               hourSend:
 *                 type: string
 *                 description: Hora de envío
 *               textSend:
 *                 type: string
 *                 description: Texto de envío
 *               dateVisit:
 *                 type: string
 *                 format: date
 *                 description: Fecha de visita
 *               sumaryVisit:
 *                 type: string
 *                 description: Resumen de visita
 *               reasonVisitNotEffective:
 *                 type: integer
 *                 description: ID del motivo de visita no efectiva
 *               areaPersonProcess:
 *                 type: integer
 *                 description: ID del área de persona en proceso
 *               programPerson:
 *                 type: integer
 *                 description: ID del programa de la persona
 *               assignmentDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de asignación
 *               idPatient:
 *                 type: integer
 *                 description: ID del paciente
 *               profetional:
 *                 type: string
 *                 description: Profesional asignado
 *               idUser:
 *                 type: integer
 *                 description: ID del usuario que crea el registro
 *     responses:
 *       201:
 *         description: Demanda inducida creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 demandInduced:
 *                   $ref: '#/components/schemas/DemandaInducida'
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Paciente no encontrado
 */
router.post("/demanda/inducida", authenticate, authorizeRoles(['1', '19', '20', '21']), createDemandInduced);

/**
 * @swagger
 * /demanda/inducida/estadistica:
 *   post:
 *     summary: Obtiene estadísticas de demanda inducida filtradas por parámetros
 *     tags: [Demanda Inducida]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - element
 *               - program
 *               - professional
 *               - year
 *               - month
 *             properties:
 *               element:
 *                 type: string
 *                 description: ID del elemento de demanda inducida
 *                 example: "1"
 *               program:
 *                 type: string
 *                 description: ID del programa
 *                 example: "2"
 *               professional:
 *                 type: string
 *                 description: Nombre del profesional
 *                 example: "Dr. Juan Pérez"
 *               year:
 *                 type: string
 *                 description: Año para el filtro de estadísticas
 *                 example: "2025"
 *               month:
 *                 type: string
 *                 description: Mes para el filtro de estadísticas (1-12)
 *                 example: "9"
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: number
 *                   description: Meta del programa para el mes especificado
 *                   example: 100
 *                 estadisticasLlamadasTelefonicas:
 *                   type: object
 *                   description: Estadísticas de llamadas efectivas vs no efectivas
 *                   properties:
 *                     efectivas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           profesional:
 *                             type: string
 *                           cantidad:
 *                             type: integer
 *                           porcentaje:
 *                             type: integer
 *                     noEfectivas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           profesional:
 *                             type: string
 *                           cantidad:
 *                             type: integer
 *                           porcentaje:
 *                             type: integer
 *                 cantidadDemandInduced:
 *                   type: array
 *                   description: Cantidad de registros de demanda inducida por programa
 *                   items:
 *                     type: object
 *                     properties:
 *                       programa:
 *                         type: integer
 *                         description: ID del programa
 *                       cantidad:
 *                         type: integer
 *                         description: Cantidad de registros
 *                 estResultadoLlamadasNoEfectivas:
 *                   type: array
 *                   description: Estadísticas de resultados de llamadas no efectivas
 *                   items:
 *                     type: object
 *                     properties:
 *                       resultadoLlamada:
 *                         type: string
 *                         description: Tipo de resultado de llamada
 *                       cantidad:
 *                         type: integer
 *                         description: Cantidad de llamadas con este resultado
 *       400:
 *         description: Error en la validación de parámetros
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Roles insuficientes
 *       500:
 *         description: Error del servidor
 */
router.post("/demanda/inducida/estadistica", authenticate, authorizeRoles(['1', '19', '20', '21', '2']), getEstadisticasDemandaInducida);

export default router;