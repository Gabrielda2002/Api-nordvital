import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createSurveySatisfaction, deleteSurveySatisfaction, getAllSurveySatisfaction, getSurveySatisfaction, isTicketServey, updateSurveySatisfaction } from "../controllers/encuestas-satisfaccion.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /encuestas-satisfaccion:
 *   get:
 *     summary: Obtiene todas las encuestas de satisfacción
 *     tags: [EncuestasSatisfaccion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de encuestas de satisfacción
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EncuestaSatisfaccion'
 */
router.get('/encuestas-satisfaccion', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.RADICADOR]), getAllSurveySatisfaction);

/**
 * @swagger
 * /encuestas-satisfaccion/{id}:
 *   get:
 *     summary: Obtiene una encuesta de satisfacción por ID
 *     tags: [EncuestasSatisfaccion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta de satisfacción
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EncuestaSatisfaccion'
 *       404:
 *         description: Encuesta no encontrada
 */
router.get('/encuentas-satisfaccion/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.RADICADOR]), validarId, getSurveySatisfaction);

/**
 * @swagger
 * /encuestas-satisfaccion:
 *   post:
 *     summary: Crea una nueva encuesta de satisfacción
 *     tags: [EncuestasSatisfaccion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EncuestaSatisfaccion'
 *     responses:
 *       201:
 *         description: Encuesta creada
 *       409:
 *         description: La encuesta ya existe
 */
router.post('/encuestas-satisfaccion', authenticate, authorizeRoles(ROLE_GROUPS.ALL), createSurveySatisfaction);

/**
 * @swagger
 * /encuestas-satisfaccion/{id}:
 *   put:
 *     summary: Actualiza una encuesta de satisfacción existente
 *     tags: [EncuestasSatisfaccion]
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
 *             $ref: '#/components/schemas/EncuestaSatisfaccion'
 *     responses:
 *       200:
 *         description: Encuesta actualizada
 *       404:
 *         description: Encuesta no encontrada
 */
router.put('/encuentas-satisfaccion/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.RADICADOR]), validarId, updateSurveySatisfaction);

/**
 * @swagger
 * /encuestas-satisfaccion/{id}:
 *   delete:
 *     summary: Elimina una encuesta de satisfacción
 *     tags: [EncuestasSatisfaccion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Encuesta eliminada
 *       404:
 *         description: Encuesta no encontrada
 */
router.delete('/encuentas-satisfaccion/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.RADICADOR]), validarId, deleteSurveySatisfaction);

/**
 * @swagger
 * /validate/servey-ticket:
 *   post:
 *     summary: Valida si un ticket tiene encuesta de satisfacción
 *     tags: [EncuestasSatisfaccion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Validación exitosa
 *       404:
 *         description: Ticket no encontrado
 */
router.post('/validate/servey-ticket', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.CALIDAD, ROLE_IDS.AUXILIAR, ROLE_IDS.COORDINADOR, ROLE_IDS.RADICADOR, ROLE_IDS.SIAU, ROLE_IDS.CONTRATACION, ROLE_IDS.MEDICO, ROLE_IDS.JEFE, ROLE_IDS.CIRUGIA, ROLE_IDS.PARAMEDICO, ROLE_IDS.SOPORTE, ROLE_IDS.RRHH]), isTicketServey);

export default router;