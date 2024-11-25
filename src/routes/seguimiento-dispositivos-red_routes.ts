import { Router } from "express";
import { createMonitoringDevicesNetwork, deleteMonitoringDevicesNetwork, getAllMonitoringDevicesNetwork, getMonitoringDevicesNetwork, updateMonitoringDevicesNetwork } from "../controllers/seguimiento-dispositivos-red_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /seguimiento-dispositivos-red:
 *   get:
 *     summary: Obtiene todos los seguimientos de dispositivos de red
 *     tags: [Seguimiento Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de seguimientos encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   deviceId:
 *                     type: integer
 *                   eventType:
 *                     type: string
 *                   dateEvent:
 *                     type: string
 *                     format: date
 *                   description:
 *                     type: string
 *                   responsible:
 *                     type: integer
 *       404:
 *         description: No se encontraron datos
 */
router.get("/seguimiento-dispositivos-red", authenticate, authorizeRoles(['1']), getAllMonitoringDevicesNetwork);

/**
 * @swagger
 * /seguimiento-dispositivos-red/{id}:
 *   get:
 *     summary: Obtiene un seguimiento específico por ID
 *     tags: [Seguimiento Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seguimiento encontrado
 *       404:
 *         description: Seguimiento no encontrado
 */
router.get("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles(['1']), validarId, getMonitoringDevicesNetwork);

/**
 * @swagger
 * /seguimiento-dispositivos-red:
 *   post:
 *     summary: Crea un nuevo seguimiento
 *     tags: [Seguimiento Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipmentId
 *               - eventType
 *               - eventDate
 *               - description
 *               - responsible
 *             properties:
 *               equipmentId:
 *                 type: integer
 *               eventType:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               responsible:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Seguimiento creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post("/seguimiento-dispositivos-red", authenticate, authorizeRoles(['1']), createMonitoringDevicesNetwork);

/**
 * @swagger
 * /seguimiento-dispositivos-red/{id}:
 *   put:
 *     summary: Actualiza un seguimiento existente
 *     tags: [Seguimiento Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipmentId:
 *                 type: integer
 *               eventType:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               responsible:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Seguimiento actualizado exitosamente
 *       404:
 *         description: Seguimiento no encontrado
 */
router.put("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles(['1']), validarId, updateMonitoringDevicesNetwork);

/**
 * @swagger
 * /seguimiento-dispositivos-red/{id}:
 *   delete:
 *     summary: Elimina un seguimiento
 *     tags: [Seguimiento Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seguimiento eliminado exitosamente
 *       404:
 *         description: Seguimiento no encontrado
 */
router.delete("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles(['1']), validarId, deleteMonitoringDevicesNetwork);

export default router;