import { Router } from "express";
import {
  initializeVacationSystem,
  getUsersPendingSetup,
  configureUserVacationBalance,
  getUserVacationBalance,
  getMyVacationBalance,
  getUserVacationNotifications,
  markNotificationAsRead,
  checkVacationExpirations,
} from "../controllers/vacation.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vacations
 *   description: Gestión de vacaciones y balances
 */

/**
 * @swagger
 * /api/vacations/initialize:
 *   post:
 *     summary: Inicializar el sistema de vacaciones (ejecutar solo una vez)
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sistema inicializado correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post("/initialize", authenticate, initializeVacationSystem);

/**
 * @swagger
 * /api/vacations/pending-setup:
 *   get:
 *     summary: Obtener usuarios pendientes de configuración (solo RRHH)
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios pendientes
 *       401:
 *         description: No autorizado
 */
router.get("/pending-setup",authenticate ,authorizeRoles(['1', '6', '20', '18', '2']), getUsersPendingSetup);

/**
 * @swagger
 * /api/vacations/configure/{userId}:
 *   post:
 *     summary: Configurar balance de vacaciones de un usuario (solo RRHH)
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               configuration:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     balanceId:
 *                       type: integer
 *                     diasTomados:
 *                       type: number
 *                     notas:
 *                       type: string
 *     responses:
 *       200:
 *         description: Balance configurado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/configure/:userId", authenticate, configureUserVacationBalance);

/**
 * @swagger
 * /api/vacations/balance/{userId}:
 *   get:
 *     summary: Obtener balance de vacaciones de un usuario
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Balance de vacaciones
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/balance/:userId", authenticate, getUserVacationBalance);

/**
 * @swagger
 * /api/vacations/my-balance:
 *   get:
 *     summary: Obtener mi balance de vacaciones
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance de vacaciones del usuario autenticado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no tiene configuración de vacaciones
 */
router.get("/my-balance", authenticate, getMyVacationBalance);

/**
 * @swagger
 * /api/vacations/notifications:
 *   get:
 *     summary: Obtener notificaciones de vacaciones
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Obtener solo notificaciones no leídas
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       401:
 *         description: No autenticado
 */
router.get("/notifications", authenticate, getUserVacationNotifications);

/**
 * @swagger
 * /api/vacations/notifications/{notificationId}/read:
 *   patch:
 *     summary: Marcar notificación como leída
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       404:
 *         description: Notificación no encontrada
 */
router.patch("/notifications/:notificationId/read", authenticate, markNotificationAsRead);

/**
 * @swagger
 * /api/vacations/check-expirations:
 *   post:
 *     summary: Ejecutar verificación de vencimientos (manual/testing)
 *     tags: [Vacations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verificación ejecutada correctamente
 */
router.post("/check-expirations", authenticate, checkVacationExpirations);

export default router;
