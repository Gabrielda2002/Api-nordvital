import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createFollowEquipment, deleteFollowEquipment, getAllFollowEquipment, getFollowEquipment, updateFollowEquipment } from "../controllers/seguimiento-equipos.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * /seguimiento-equipos:
 *   get:
 *     summary: Obtiene todos los seguimientos de equipos
 *     tags: [Seguimiento de Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de seguimientos encontrada
 *       404:
 *         description: No se encontraron datos
 */
router.get("/seguimiento-equipos", authenticate, authorizeRoles(['1']), getAllFollowEquipment);

/**
 * @swagger
 * /seguimiento-equipos/{id}:
 *   get:
 *     summary: Obtiene un seguimiento de equipo por ID
 *     tags: [Seguimiento de Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del seguimiento
 *     responses:
 *       200:
 *         description: Seguimiento encontrado
 *       404:
 *         description: Seguimiento no encontrado
 */
router.get("/seguimiento-equipos/:id", authenticate, authorizeRoles(['1']), validarId, getFollowEquipment); 

/**
 * @swagger
 * /seguimiento-equipos:
 *   post:
 *     summary: Crea un nuevo seguimiento de equipo
 *     tags: [Seguimiento de Equipos]
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
 *               - eventDate
 *               - eventType
 *               - description
 *               - responsible
 *             properties:
 *               equipmentId:
 *                 type: integer
 *               eventDate:
 *                 type: string
 *                 format: date
 *               eventType:
 *                 type: string
 *               description:
 *                 type: string
 *               responsible:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Seguimiento creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/seguimiento-equipos", authenticate, authorizeRoles(['1']), createFollowEquipment);

/**
 * @swagger
 * /seguimiento-equipos/{id}:
 *   put:
 *     summary: Actualiza un seguimiento de equipo
 *     tags: [Seguimiento de Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del seguimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipmentId:
 *                 type: integer
 *               eventDate:
 *                 type: string
 *                 format: date
 *               eventType:
 *                 type: string
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
router.put("/seguimiento-equipos/:id", authenticate, authorizeRoles(['1']), validarId, updateFollowEquipment);

/**
 * @swagger
 * /seguimiento-equipos/{id}:
 *   delete:
 *     summary: Elimina un seguimiento de equipo
 *     tags: [Seguimiento de Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del seguimiento
 *     responses:
 *       200:
 *         description: Seguimiento eliminado exitosamente
 *       404:
 *         description: Seguimiento no encontrado
 */
router.delete("/seguimiento-equipos/:id", authenticate, authorizeRoles(['1']), validarId, deleteFollowEquipment);

export default router;