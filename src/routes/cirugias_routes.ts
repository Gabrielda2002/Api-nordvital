import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createSurgery, deleteSurgery, getAllSurgery, getSurgery, updateSurgery } from "../controllers/cirugias.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     Cirugia:
 *       type: object
 *       required:
 *         - surgeryDate
 *         - scheduledTime
 *         - ipsRemite
 *         - radicadoId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la cirugía
 *         surgeryDate:
 *           type: string
 *           format: date
 *           description: Fecha programada de la cirugía
 *         scheduledTime:
 *           type: string
 *           description: Hora programada de la cirugía
 *         ipsRemite:
 *           type: integer
 *           description: ID de la IPS que remite
 *         observation:
 *           type: string
 *           description: Observaciones adicionales
 *         status:
 *           type: boolean
 *           default: true
 *           description: Estado de la cirugía
 *         radicadoId:
 *           type: integer
 *           description: ID del radicado asociado
 *         paraclinicalDate:
 *           type: string
 *           format: date
 *           description: Fecha de paraclínicos
 *         anesthesiologyDate:
 *           type: string
 *           format: date
 *           description: Fecha de valoración por anestesiología
 *         specialist:
 *           type: string
 *           description: Nombre del especialista
 */

/**
 * @swagger
 * /cirugias:
 *   get:
 *     summary: Obtiene lista de cirugías
 *     tags: [Cirugías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cirugías encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cirugia'
 *   post:
 *     summary: Crea una nueva cirugía
 *     tags: [Cirugías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cirugia'
 *     responses:
 *       201:
 *         description: Cirugía creada exitosamente
 *       400:
 *         description: Error en los datos enviados
 */

/**
 * @swagger
 * /cirugias/{id}:
 *   get:
 *     summary: Obtiene una cirugía por ID
 *     tags: [Cirugías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cirugía
 *     responses:
 *       200:
 *         description: Cirugía encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cirugia'
 *       404:
 *         description: Cirugía no encontrada
 *   
 *   put:
 *     summary: Actualiza una cirugía existente
 *     tags: [Cirugías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cirugía
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cirugia'
 *     responses:
 *       200:
 *         description: Cirugía actualizada exitosamente
 *       404:
 *         description: Cirugía no encontrada
 *       400:
 *         description: Error en los datos enviados
 *
 *   delete:
 *     summary: Elimina una cirugía
 *     tags: [Cirugías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cirugía
 *     responses:
 *       200:
 *         description: Cirugía eliminada exitosamente
 *       404:
 *         description: Cirugía no encontrada
 */

const router = Router();

router.get('/cirugias', authenticate, authorizeRoles(['1', '15']), getAllSurgery);

router.get('/cirugias/:id', authenticate, authorizeRoles(['1', '15']), validarId, getSurgery);

router.post('/cirugias', authenticate, authorizeRoles(['1', '15', '3']), createSurgery);

router.put('/cirugias/:id', authenticate, authorizeRoles(['1', '15']), validarId, updateSurgery);

router.delete('/cirugias/:id', authenticate, authorizeRoles(['1']), validarId, deleteSurgery);

export default router;