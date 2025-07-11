import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createEquipment, deleteEquipment, getAllEquipments, getEquipmentAgeBySede, getEquipmentBySede, getEquipmentHeadquartersDistribution, getEquipmentLockStatistics, getEquipmentTypeDistribution, getEquipmentWarrantyStatistics, searchEquipmentGlobal, updateEquipment } from "../controllers/equipos.controller";
import { validarId } from "../middlewares/validar-id";
import { uploadDocDelivery } from "../middlewares/upload-doc-delivery_middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         sedeId:
 *           type: integer
 *         name:
 *           type: string
 *         typeEquipment:
 *           type: string
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         serial:
 *           type: string
 *         operationalSystem:
 *           type: string
 *         addressIp:
 *           type: string
 *         mac:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date
 *         warrantyTime:
 *           type: string
 *         warranty:
 *           type: boolean
 *         deliveryDate:
 *           type: string
 *           format: date
 *         inventoryNumber:
 *           type: string
 *         dhcp:
 *           type: boolean
 *         idUsuario:
 *           type: integer
 *           nullable: true
 *         lock: 
 *           type: boolean
 *         lockKey:
 *           type: string
 *           nullable: true
 */        

/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Obtiene todos los equipos
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 */
router.get("/equipos", authenticate, authorizeRoles(['1']), getAllEquipments);

/**
 * @swagger
 * /equipos/{id}:
 *   get:
 *     summary: Obtiene un equipo por ID
 *     tags: [Equipos]
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
 *         description: Equipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: Equipo no encontrado
 */
router.get("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, getAllEquipments);

/**
 * @swagger
 * /equipos:
 *   post:
 *     summary: Crea un nuevo equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       400:
 *         description: Datos inválidos
 */
router.post("/equipos", authenticate, authorizeRoles(['1']), uploadDocDelivery, createEquipment);

/**
 * @swagger
 * /equipos/{id}:
 *   put:
 *     summary: Actualiza un equipo
 *     tags: [Equipos]
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
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *       404:
 *         description: Equipo no encontrado
 */
router.put("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, uploadDocDelivery, updateEquipment);

/**
 * @swagger
 * /equipos/{id}:
 *   delete:
 *     summary: Elimina un equipo
 *     tags: [Equipos]
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
 *         description: Equipo eliminado
 *       404:
 *         description: Equipo no encontrado
 */
router.delete("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, deleteEquipment);

/**
 * @swagger
 * /equipos-sede/{id}:
 *   get:
 *     summary: Obtiene equipos por sede
 *     tags: [Equipos]
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
 *         description: Lista de equipos de la sede
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: No se encontraron equipos
 */
router.get("/equipos-sede/:id", authenticate, authorizeRoles(['1', '4']), validarId, getEquipmentBySede);

router.get('/equipments/statics/typeEquipment', authenticate, authorizeRoles(['1']), getEquipmentTypeDistribution);

router.get('/equipments/statics/headquarters', authenticate, authorizeRoles(['1']), getEquipmentHeadquartersDistribution);

router.get('/equipments/statics/age', authenticate, authorizeRoles(['1']), getEquipmentAgeBySede);

router.get('/equipments/statics/warrantyExpiration', authenticate, authorizeRoles(['1']), getEquipmentWarrantyStatistics);

router.get('/equipments/statics/withLock', authenticate, authorizeRoles(['1']), getEquipmentLockStatistics);

router.get('/search/equipos', authenticate, authorizeRoles(['1']), searchEquipmentGlobal);

export default router;