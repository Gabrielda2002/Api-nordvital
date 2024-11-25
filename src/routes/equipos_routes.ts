import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createEquipment, deleteEquipment, getAllEquipments, getEquipmentBySede, updateEquipment } from "../controllers/equipos_controller";
import { validarId } from "../middlewares/validar-id";

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
 *         area:
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
router.post("/equipos", authenticate, authorizeRoles(['1']), createEquipment);

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
router.put("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, updateEquipment);

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
router.get("/equipos-sede/:id", authenticate, authorizeRoles(['1']), validarId, getEquipmentBySede);

export default router;