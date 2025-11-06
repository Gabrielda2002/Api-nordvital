import { Router } from "express";
import { createLugarRadicacion, deleteLugarRadicacion, getAllLugaresRadicacion, getLugaresRadicacionByDepartment, getLugaresRadicacionByName, getLugarRadicacion, updateLugarRadicacion, updateStatusLugarRadicacion } from "../controllers/lugar-radicacion.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

/**
 * @swagger
 * /lugares-radicacion:
 *   get:
 *     summary: Obtiene todos los lugares de radicación
 *     tags: [Lugares de Radicación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lugares de radicación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LugarRadicacion'
 */
router.get("/lugares-radicacion", authenticate, authorizeRoles(['1', '2']), getAllLugaresRadicacion);

/**
 * @swagger
 * /lugares-radicacion/{id}:
 *   get:
 *     summary: Obtiene un lugar de radicación por ID
 *     tags: [Lugares de Radicación]
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
 *         description: Lugar de radicación encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LugarRadicacion'
 *       404:
 *         description: Lugar de radicación no encontrado
 */
router.get("/lugares-radicacion/:id",authenticate, authorizeRoles(['1', '2']),validarId , getLugarRadicacion);

/**
 * @swagger
 * /lugares-radicacion:
 *   post:
 *     summary: Crea un nuevo lugar de radicación
 *     tags: [Lugares de Radicación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LugarRadicacion'
 *     responses:
 *       200:
 *         description: Lugar de radicación creado
 *       400:
 *         description: Error en la creación
 */
router.post("/lugares-radicacion",authenticate, authorizeRoles(['1', '2']), createLugarRadicacion);

/**
 * @swagger
 * /lugares-radicacion/{id}:
 *   put:
 *     summary: Actualiza un lugar de radicación
 *     tags: [Lugares de Radicación]
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
 *         description: Lugar de radicación actualizado
 *       404:
 *         description: Lugar de radicación no encontrado
 */
router.put("/lugares-radicacion/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateLugarRadicacion);

/**
 * @swagger
 * /lugares-radicacion/{id}:
 *   delete:
 *     summary: Elimina un lugar de radicación
 *     tags: [Lugares de Radicación]
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
 *         description: Lugar de radicación eliminado
 *       404:
 *         description: Lugar de radicación no encontrado
 */
router.delete("/lugares-radicacion/:id",authenticate, authorizeRoles(['1']),validarId ,deleteLugarRadicacion);

/**
 * @swagger
 * /lugares-radicacion-name:
 *   post:
 *     summary: Busca lugares de radicación por nombre
 *     tags: [Lugares de Radicación]
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
 *         description: Lugares de radicación encontrados
 */
router.post("/lugares-radicacion-name",authenticate, authorizeRoles(['1', '3','10','15', '6', '20','21']), getLugaresRadicacionByName);

/**
 * @swagger
 * /update-lugar-status/{id}:
 *   put:
 *     summary: Actualiza el estado de un lugar de radicación
 *     tags: [Lugares de Radicación]
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
 *         description: Estado actualizado
 *       404:
 *         description: Lugar de radicación no encontrado
 */
router.put("/update-lugar-status/:id",authenticate, authorizeRoles(['1', '2']),validarId , updateStatusLugarRadicacion);

/**
 * @swagger
 * /lugares-radicacion-departamento/{id}:
 *   get:
 *     summary: Obtiene lugares de radicación por departamento
 *     tags: [Lugares de Radicación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Lista de lugares de radicación del departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LugarRadicacion'
 *       404:
 *         description: No se encontraron lugares de radicación
 */
router.get("/sede/departamento/:id",authenticate, authorizeRoles(['1', '6', '4']),validarId , getLugaresRadicacionByDepartment);

export default router;