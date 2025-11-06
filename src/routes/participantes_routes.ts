import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createParticipant, getAllParticipants } from "../controllers/participantes.controller";

const router = Router();

/**
 * @swagger
 * /participants:
 *   get:
 *     summary: Obtener todos los participantes registrados
 *     tags: [Participantes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de participantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participante'
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/participants', authenticate, authorizeRoles(['1']), getAllParticipants);

/**
 * @swagger
 * /participants:
 *   post:
 *     summary: Crear un nuevo participante
 *     tags: [Participantes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipanteInput'
 *     responses:
 *       201:
 *         description: Participante creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 participant:
 *                   $ref: '#/components/schemas/Participante'
 *       400:
 *         description: Error de validación o participante ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/participants', createParticipant);

export default router;