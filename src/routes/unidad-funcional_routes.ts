import { Router } from "express";
import { createUnidadFuncional, deleteUnidadFuncional, getAllUnidadFuncional, getUnidadFuncionalById, updateUnidadFuncional } from "../controllers/unidad-funcional.controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /unidad-funcional:
 *   get:
 *     summary: Obtiene todas las unidades funcionales
 *     tags: [Unidades Funcionales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades funcionales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UnidadFuncional'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Forbiden - No tiene permisos
 */
router.get('/unidad-funcional',authenticate, authorizeRoles(['1' , '3']), getAllUnidadFuncional);

/**
 * @swagger
 * /unidad-funcional:
 *   post:
 *     summary: Crea una nueva unidad funcional
 *     tags: [Unidades Funcionales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unidad funcional creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnidadFuncional'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: La unidad funcional ya existe
 */
router.post('/unidad-funcional',authenticate, authorizeRoles(['1' , '2']), createUnidadFuncional);

/**
 * @swagger
 * /unidad-funcional/{id}:
 *   get:
 *     summary: Obtiene una unidad funcional por ID
 *     tags: [Unidades Funcionales]
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
 *         description: Unidad funcional encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnidadFuncional'
 *       404:
 *         description: Unidad funcional no encontrada
 */
router.get('/unidad-funcional/:id',authenticate, authorizeRoles(['1' , '2']),validarId ,getUnidadFuncionalById);

/**
 * @swagger
 * /unidad-funcional/{id}:
 *   put:
 *     summary: Actualiza una unidad funcional
 *     tags: [Unidades Funcionales]
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
 *               name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Unidad funcional actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnidadFuncional'
 *       404:
 *         description: Unidad funcional no encontrada
 */
router.put('/unidad-funcional/:id',authenticate, authorizeRoles(['1' , '2']),validarId ,updateUnidadFuncional);

/**
 * @swagger
 * /unidad-funcional/{id}:
 *   delete:
 *     summary: Elimina una unidad funcional
 *     tags: [Unidades Funcionales]
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
 *         description: Unidad funcional eliminada
 *       404:
 *         description: Unidad funcional no encontrada
 */
router.delete('/unidad-funcional/:id',authenticate, authorizeRoles(['1']),validarId ,deleteUnidadFuncional);

export default router;