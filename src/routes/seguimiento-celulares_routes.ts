import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createProcessPhone } from "../controllers/seguimiento-celulares_controller";


const router = Router();
/**
 * @swagger
 * /seguimiento/celulares:
 *   post:
 *     summary: Registrar un evento de seguimiento para un celular
 *     tags: [SeguimientoCelular]
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
 *                 description: ID del celular relacionado
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
 *               $ref: '#/components/schemas/SeguimientoCelular'
 *       400:
 *         description: Error de validación en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/seguimiento/celulares',authenticate ,authorizeRoles(['1']), createProcessPhone);

export default router;