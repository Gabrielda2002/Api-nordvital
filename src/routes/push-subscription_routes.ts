// src/routes/push_routes.ts
import { Router } from "express";
import { getVapidPublicKey, subscribe, unsubscribe, sendTestPush } from "../controllers/push-subscription_controller";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

/**
 * @swagger
 * /push/vapid-public-key:
 *   get:
 *     summary: Obtener clave pública VAPID para suscripciones push
 *     tags: [Push Notifications]
 *     responses:
 *       200:
 *         description: Clave pública VAPID
 */
router.get('/push/vapid-public-key', getVapidPublicKey);

/**
 * @swagger
 * /push/subscribe:
 *   post:
 *     summary: Suscribirse a notificaciones push
 *     tags: [Push Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - subscription
 *             properties:
 *               userId:
 *                 type: integer
 *               subscription:
 *                 type: object
 *     responses:
 *       201:
 *         description: Suscripción guardada
 */
router.post('/push/subscribe', authenticate, subscribe);

/**
 * @swagger
 * /push/unsubscribe:
 *   post:
 *     summary: Cancelar suscripción a notificaciones push
 *     tags: [Push Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - endpoint
 *             properties:
 *               userId:
 *                 type: integer
 *               endpoint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suscripción cancelada
 */
router.post('/push/unsubscribe', authenticate, unsubscribe);

/**
 * @swagger
 * /push/test/{userId}:
 *   post:
 *     summary: Enviar notificación push de prueba
 *     tags: [Push Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Notificación de prueba enviada
 */
router.post('/push/test/:userId', authenticate, authorizeRoles(['1']), sendTestPush);

export default router;