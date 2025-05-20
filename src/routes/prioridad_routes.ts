import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPriority, deletePriority, getAllPriority, getPriorityById, updatePriority } from "../controllers/prioridad_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /prioridades:
 *   get:
 *     summary: Obtener todas las prioridades
 *     tags: [Prioridades]
 *     responses:
 *       200:
 *         description: Lista de todas las prioridades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prioridad'
 */
router.get('/prioridades', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18']), getAllPriority);

/**
 * @swagger
 * /prioridades/{id}:
 *   get:
 *     summary: Obtener una prioridad por ID
 *     tags: [Prioridades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     responses:
 *       200:
 *         description: Prioridad obtenida por ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prioridad'
 *       404:
 *         description: Prioridad no encontrada
 */
router.get('/prioridades/:id', authenticate, authorizeRoles(['1']), validarId, getPriorityById);

/**
 * @swagger
 * /prioridades:
 *   post:
 *     summary: Crear una nueva prioridad
 *     tags: [Prioridades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prioridad'
 *     responses:
 *       200:
 *         description: Prioridad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prioridad'
 *       400:
 *         description: Error en la solicitud
 */
router.post('/prioridades', authenticate, authorizeRoles(['1']), createPriority);

/**
 * @swagger
 * /prioridades/{id}:
 *   put:
 *     summary: Actualizar una prioridad por ID
 *     tags: [Prioridades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prioridad'
 *     responses:
 *       200:
 *         description: Prioridad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prioridad'
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Prioridad no encontrada
 */
router.put('/prioridades/:id', authenticate, authorizeRoles(['1']), updatePriority);

/**
 * @swagger
 * /prioridades/{id}:
 *   delete:
 *     summary: Eliminar una prioridad por ID
 *     tags: [Prioridades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     responses:
 *       200:
 *         description: Prioridad eliminada exitosamente
 *       404:
 *         description: Prioridad no encontrada
 */
router.delete('/prioridades/:id', authenticate, authorizeRoles(['1']), validarId, deletePriority);

export default router;