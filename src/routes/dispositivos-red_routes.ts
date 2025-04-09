import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createDevice, deleteDevice, getAllDevices, getDevice, getDevicesBySede, getDevicesCountByHeadquarters, updateDevice } from "../controllers/dispositivos-red_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DispositivoRed:
 *       type: object
 *       required:
 *         - sedeId
 *         - name
 *         - brand
 *         - model
 *         - serial
 *         - addressIp
 *         - mac
 *         - status
 *         - inventoryNumber
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del dispositivo
 *         sedeId:
 *           type: integer
 *           description: ID de la sede a la que pertenece el dispositivo
 *         name:
 *           type: string
 *           description: Nombre del dispositivo
 *         brand:
 *           type: string
 *           description: Marca del dispositivo
 *         model:
 *           type: string
 *           description: Modelo del dispositivo
 *         serial:
 *           type: string
 *           description: Número de serie del dispositivo
 *         addressIp:
 *           type: string
 *           description: Dirección IP del dispositivo
 *         mac:
 *           type: string
 *           description: Dirección MAC del dispositivo
 *         otherData:
 *           type: string
 *           description: Información adicional del dispositivo
 *         status:
 *           type: string
 *           description: Estado del dispositivo
 *         inventoryNumber:
 *           type: string
 *           description: Número de inventario
 */

/**
 * @swagger
 * /dispositivos-red:
 *   get:
 *     summary: Obtiene todos los dispositivos de red
 *     tags: [Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dispositivos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DispositivoRed'
 *       404:
 *         description: No se encontraron dispositivos
 */
router.get("/dispositivos-red", authenticate, authorizeRoles(['1']), getAllDevices);

/**
 * @swagger
 * /dispositivos-red/{id}:
 *   get:
 *     summary: Obtiene un dispositivo por ID
 *     tags: [Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DispositivoRed'
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get("/dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, getDevice);

/**
 * @swagger
 * /dispositivos-red:
 *   post:
 *     summary: Crea un nuevo dispositivo
 *     tags: [Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DispositivoRed'
 *     responses:
 *       200:
 *         description: Dispositivo creado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 */
router.post("/dispositivos-red", authenticate, authorizeRoles(['1']), createDevice);

/**
 * @swagger
 * /dispositivos-red/{id}:
 *   put:
 *     summary: Actualiza un dispositivo existente
 *     tags: [Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DispositivoRed'
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente
 *       404:
 *         description: Dispositivo no encontrado
 */
router.put("/dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, updateDevice);

/**
 * @swagger
 * /dispositivos-red/{id}:
 *   delete:
 *     summary: Elimina un dispositivo
 *     tags: [Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo eliminado exitosamente
 *       404:
 *         description: Dispositivo no encontrado
 */
router.delete("/dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, deleteDevice);

/**
 * @swagger
 * /dispositivos-red-sede/{id}:
 *   get:
 *     summary: Obtiene todos los dispositivos de una sede específica
 *     tags: [Dispositivos de Red]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Lista de dispositivos encontrados en la sede
 *       404:
 *         description: No se encontraron dispositivos
 */
router.get("/dispositivos-red-sede/:id", authenticate, authorizeRoles(['1']),validarId, getDevicesBySede);

router.get('/dispositivos-red/statistics/headquarters', authenticate, authorizeRoles(['1']), getDevicesCountByHeadquarters);

export default router;