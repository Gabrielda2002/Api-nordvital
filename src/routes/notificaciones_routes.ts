// src/routes/notification_routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificaciones_controller";

const router = Router();

/**
 * @swagger
 * /notifications/user/{userId}:
 *   get:
 *     summary: Obtener todas las notificaciones de un usuario
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 */
router.get('/notifications/user/:userId', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '18']), getUserNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Marcar una notificación como leída
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       404:
 *         description: Notificación no encontrada
 */
router.put('/notifications/:id/read', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '18']), markNotificationAsRead);

export default router;