import { Router } from "express";
import { createEspecialidad, deleteEspecialidad, getAllEspecialidades, getEspecialidad, getEspecialidadesByName, updateEspecialidad, updateStatusEspecialidad } from "../controllers/especialidad.controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Especialidad:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         status:
 *           type: boolean
 *       required:
 *         - name
 */

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Obtiene todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Especialidad'
 */
router.get("/especialidades", getAllEspecialidades);

/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Obtiene una especialidad por ID
 *     tags: [Especialidades]
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
 *         description: Detalles de la especialidad
 *       404:
 *         description: Especialidad no encontrada
 */
router.get("/especialidades/:id", authenticate, authorizeRoles(['1', '2']), validarId, getEspecialidad);

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crea una nueva especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Especialidad creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/especialidades", authenticate, authorizeRoles(['1', '2']), createEspecialidad);

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Actualiza una especialidad
 *     tags: [Especialidades]
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
 *         description: Especialidad actualizada exitosamente
 *       404:
 *         description: Especialidad no encontrada
 */
router.put("/especialidades/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateEspecialidad);

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Elimina una especialidad
 *     tags: [Especialidades]
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
 *         description: Especialidad eliminada exitosamente
 *       404:
 *         description: Especialidad no encontrada
 */
router.delete("/especialidades/:id", authenticate, authorizeRoles(['1']), validarId, deleteEspecialidad);

/**
 * @swagger
 * /especialidades-name:
 *   post:
 *     summary: Busca especialidades por nombre
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lista de especialidades encontradas
 *       404:
 *         description: No se encontraron especialidades
 */
router.post("/especialidades-name", authenticate, authorizeRoles(['1', '3','10','15', '6']), getEspecialidadesByName);

/**
 * @swagger
 * /update-status-especialidad/{id}:
 *   put:
 *     summary: Actualiza el estado de una especialidad
 *     tags: [Especialidades]
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
 *         description: Estado de especialidad actualizado
 *       404:
 *         description: Especialidad no encontrada
 */
router.put("/update-status-especialidad/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateStatusEspecialidad);

export default router;