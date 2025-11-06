import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createGoal, deleteGoal, getGoalsByPrograms } from "../controllers/programa-meta-historico.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/metas/programas:
 *   get:
 *     summary: Obtiene las metas de programas activos del mes actual
 *     tags: [Metas de Programas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de metas de programas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la meta
 *                   program:
 *                     type: string
 *                     description: Nombre del programa
 *                   goal:
 *                     type: number
 *                     description: Valor de la meta
 *                   year:
 *                     type: integer
 *                     description: Año de la meta
 *                   month:
 *                     type: integer
 *                     description: Mes de la meta
 *                   professional:
 *                     type: string
 *                     description: Profesional asignado
 *                   headquarters:
 *                     type: string
 *                     description: Nombre de la sede
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Roles insuficientes
 *       500:
 *         description: Error del servidor
 */
router.get("/metas/programas", authenticate, authorizeRoles(["1",  '19', '20', '21']), getGoalsByPrograms);

/**
 * @swagger
 * /api/v1/metas/programas:
 *   post:
 *     summary: Crea una nueva meta para un programa
 *     tags: [Metas de Programas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - program
 *               - goal
 *             properties:
 *               program:
 *                 oneOf:
 *                   - type: string
 *                     description: Nombre del programa
 *                   - type: integer
 *                     description: ID del programa
 *               goal:
 *                 type: number
 *                 description: Valor de la meta a establecer
 *               professional:
 *                 type: string
 *                 description: Profesional responsable de la meta
 *               headquarters:
 *                 oneOf:
 *                   - type: string
 *                     description: Nombre de la sede
 *                   - type: integer
 *                     description: ID de la sede
 *     responses:
 *       201:
 *         description: Meta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Datos de la meta creada
 *       400:
 *         description: Error en validación - Programa y meta son requeridos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Roles insuficientes
 *       500:
 *         description: Error del servidor
 */
router.post("/metas/programas", authenticate, authorizeRoles(["1", '20', '21']), createGoal);

/**
 * @swagger
 * /api/v1/metas/programas/{id}:
 *   delete:
 *     summary: Elimina una meta de programa por ID
 *     tags: [Metas de Programas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la meta a eliminar
 *     responses:
 *       200:
 *         description: Meta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Goal deleted successfully."
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Roles insuficientes
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/metas/programas/:id", authenticate, authorizeRoles(["1", '20']), deleteGoal);

export default router;