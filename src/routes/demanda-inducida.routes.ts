import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createDemandInduced, getAllDemandInduded } from "../controllers/demanda-inducida.controller";

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
router.get("/demanda/inducida", authenticate, authorizeRoles(['1']), getAllDemandInduded);

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
router.post("/demanda/inducida", authenticate, authorizeRoles(['1']), createDemandInduced);

export default router;