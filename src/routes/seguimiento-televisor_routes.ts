import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createProcessTelevisor } from "../controllers/seguimiento-televisores.controller";

/**
 * @swagger
 * /seguimiento/televisor:
 *   post:
 *     summary: Registrar un evento de seguimiento para un televisor
 *     tags: [SeguimientoTelevisor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - eventDate
 *               - typeEvent
 *               - description
 *               - responsable
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: ID del televisor relacionado
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del evento
 *               typeEvent:
 *                 type: string
 *                 description: Tipo de evento realizado
 *               description:
 *                 type: string
 *                 description: Descripción del evento
 *               responsable:
 *                 type: integer
 *                 description: ID del usuario responsable del evento
 *     responses:
 *       201:
 *         description: Evento de seguimiento registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguimientoTelevisor'
 *       400:
 *         description: Error de validación en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */

const router = Router();

router.post('/seguimiento/televisor', authenticate, authorizeRoles(['1']), createProcessTelevisor);

export default router;