import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getRegisterEntriesByDocument } from "../controllers/registro-entrada.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroEntrada:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del registro de entrada
 *         userName:
 *           type: string
 *           description: Nombre del usuario
 *         userLastName:
 *           type: string
 *           description: Apellido del usuario
 *         documentNumber:
 *           type: integer
 *           description: Número de documento del usuario
 *         headquarters:
 *           type: string
 *           description: Nombre de la sede
 *         registerDate:
 *           type: string
 *           format: date
 *           description: Fecha de registro
 *         hourRegister:
 *           type: string
 *           description: Hora de registro
 */

/**
 * @swagger
 * /registro-entrada:
 *   post:
 *     summary: Obtiene registros de entrada por número de documento
 *     security:
 *       - bearerAuth: []
 *     tags: [Registro Entrada]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentNumber
 *             properties:
 *               documentNumber:
 *                 type: integer
 *                 description: Número de documento del usuario
 *               dateStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del rango de búsqueda (opcional)
 *               dateEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del rango de búsqueda (opcional)
 *     responses:
 *       200:
 *         description: Registros de entrada encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroEntrada'
 *       404:
 *         description: No se encontraron registros de entrada
 */
router.post('/registro-entrada', authenticate, authorizeRoles(['1', '18']), getRegisterEntriesByDocument);

export default router;