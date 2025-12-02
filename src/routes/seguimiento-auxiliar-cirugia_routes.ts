import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createAuxiliarySurgery, deleteAuxiliarySurgery, getAllAuxiliarySurgeries, getAuxiliarySurgery, updateAuxiliarySurgery } from "../controllers/seguimiento-auxiliar-cirugias.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * /seguimiento-auxiliar-cirugia:
 *   get:
 *     summary: Obtener todos los seguimientos auxiliares de cirugías
 *     tags: [Seguimientos Auxiliares Cirugías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de seguimientos auxiliares de cirugías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SeguimientoAuxiliarCirugias'
 */
router.get('/seguimiento-auxiliar-cirugia', authenticate, authorizeRoles(['1', '2']), getAllAuxiliarySurgeries);

/**
 * @swagger
 * /seguimiento-auxiliar-cirugia/{id}:
 *   get:
 *     summary: Obtener un seguimiento auxiliar de cirugía por ID
 *     tags: [Seguimientos Auxiliares Cirugías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del seguimiento
 *     responses:
 *       200:
 *         description: Seguimiento auxiliar de cirugía encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguimientoAuxiliarCirugias'
 *       404:
 *         description: Seguimiento no encontrado
 */
router.get('/seguimiento-auxiliar-cirugia/:id', authenticate, authorizeRoles(['1', '2']), validarId, getAuxiliarySurgery);

/**
 * @swagger
 * /seguimiento-auxiliar-cirugia:
 *   post:
 *     summary: Crear un nuevo seguimiento auxiliar de cirugía
 *     tags: [Seguimientos Auxiliares Cirugías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['observation', 'status', 'surgeryId']
 *             properties:
 *               observation:
 *                 type: string
 *               status:
 *                 type: boolean
 *               surgeryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Seguimiento creado exitosamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/seguimiento-auxiliar-cirugia', authenticate, authorizeRoles(['1', '15', '3']), createAuxiliarySurgery);

/**
 * @swagger
 * /seguimiento-auxiliar-cirugia/{id}:
 *   put:
 *     summary: Actualizar un seguimiento auxiliar de cirugía
 *     tags: [Seguimientos Auxiliares Cirugías]
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
 *             $ref: '#/components/schemas/SeguimientoAuxiliarCirugias'
 *     responses:
 *       200:
 *         description: Seguimiento actualizado exitosamente
 *       404:
 *         description: Seguimiento no encontrado
 */
router.put('/seguimiento-auxiliar-cirugia/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateAuxiliarySurgery);

/**
 * @swagger
 * /seguimiento-auxiliar-cirugia/{id}:
 *   delete:
 *     summary: Eliminar un seguimiento auxiliar de cirugía
 *     tags: [Seguimientos Auxiliares Cirugías]
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
router.delete('/seguimiento-auxiliar-cirugia/:id', authenticate, authorizeRoles(['1', '2']), validarId, deleteAuxiliarySurgery);

export default router;