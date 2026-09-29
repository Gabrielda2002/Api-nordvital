import { Router } from "express";
import { createMonitoringDevicesNetwork, deleteMonitoringDevicesNetwork, getAllMonitoringDevicesNetwork, getMonitoringDevicesNetwork, updateMonitoringDevicesNetwork } from "../controllers/seguimiento-dispositivos-red.controller";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS } from "@core/constants/roles";

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
 *                 $ref: '#/components/schemas/SeguimientoDispositivosRed'
 *       404:
 *         description: No se encontraron datos
 */
router.get("/seguimiento-dispositivos-red", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllMonitoringDevicesNetwork);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguimientoDispositivosRed'
 *       404:
 *         description: Seguimiento no encontrado
 */
router.get("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getMonitoringDevicesNetwork);

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
 *             $ref: '#/components/schemas/SeguimientoDispositivosRedRequest'
 *     responses:
 *       200:
 *         description: Seguimiento creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post("/seguimiento-dispositivos-red", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), createMonitoringDevicesNetwork);

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
 *             $ref: '#/components/schemas/SeguimientoDispositivosRedRequest'
 *     responses:
 *       200:
 *         description: Seguimiento actualizado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Seguimiento no encontrado
 */
router.put("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, updateMonitoringDevicesNetwork);

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
router.delete("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteMonitoringDevicesNetwork);

export default router;