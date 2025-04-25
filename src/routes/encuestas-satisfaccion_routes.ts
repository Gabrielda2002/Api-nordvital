import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createSurveySatisfaction, deleteSurveySatisfaction, getAllSurveySatisfaction, getSurveySatisfaction, isTicketServey, updateSurveySatisfaction } from "../controllers/encuestas-satisfaccion_controller";
import { validarId } from "../middlewares/validar-id";

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
router.get('/encuestas-satisfaccion', authenticate, authorizeRoles(['1', '10']), getAllSurveySatisfaction);

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
router.get('/encuentas-satisfaccion/:id', authenticate, authorizeRoles(['1', '10']), validarId, getSurveySatisfaction);

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
router.post('/encuestas-satisfaccion', authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18']), createSurveySatisfaction);

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
router.put('/encuentas-satisfaccion/:id', authenticate, authorizeRoles(['1', '10']), validarId, updateSurveySatisfaction);

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
router.delete('/encuentas-satisfaccion/:id', authenticate, authorizeRoles(['1', '10']), validarId, deleteSurveySatisfaction);

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
router.post('/validate/servey-ticket', authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18']), isTicketServey);

export default router;