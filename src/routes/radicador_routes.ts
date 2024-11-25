import { Router } from "express";
import { createRadicador, deleteRadicador, getAllRadicador, getRadicador, updateRadicador, updateStatusRadicador } from "../controllers/radicador_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

/**
 * @swagger
 * /radicador:
 *   get:
 *     summary: Obtiene todos los radicadores
 *     tags: [Radicadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de radicadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Radicador'
 */
router.get("/radicador",authenticate, authorizeRoles(['1', '2', '10']), getAllRadicador);

/**
 * @swagger
 * /radicador/{id}:
 *   get:
 *     summary: Obtiene un radicador por ID
 *     tags: [Radicadores]
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
 *         description: Radicador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Radicador'
 *       404:
 *         description: Radicador no encontrado
 */
router.get("/radicador/:id",authenticate, authorizeRoles(['1', '2']), validarId, getRadicador);

/**
 * @swagger
 * /radicador:
 *   post:
 *     summary: Crea un nuevo radicador
 *     tags: [Radicadores]
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
 *         description: Radicador creado
 *       409:
 *         description: Radicador ya existe
 */
router.post("/radicador",authenticate, authorizeRoles(['1', '2']), createRadicador);

/**
 * @swagger
 * /radicador/{id}:
 *   put:
 *     summary: Actualiza un radicador
 *     tags: [Radicadores]
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
 *         description: Radicador actualizado
 *       404:
 *         description: Radicador no encontrado
 */
router.put("/radicador/:id",authenticate, authorizeRoles(['1', '2']), validarId, updateRadicador);

/**
 * @swagger
 * /update-status-radicador/{id}:
 *   put:
 *     summary: Actualiza el estado de un radicador
 *     tags: [Radicadores]
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
 *               status:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado del radicador actualizado
 *       404:
 *         description: Radicador no encontrado
 */
router.put("/update-status-radicador/:id",authenticate, authorizeRoles(['1', '2']), validarId, updateStatusRadicador);

/**
 * @swagger
 * /radicador/{id}:
 *   delete:
 *     summary: Elimina un radicador
 *     tags: [Radicadores]
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
 *         description: Radicador eliminado
 *       404:
 *         description: Radicador no encontrado
 */
router.delete("/radicador/:id",authenticate, authorizeRoles(['1']), validarId, deleteRadicador);

export default router;