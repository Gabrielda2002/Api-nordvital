import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createArea, getAllAreas, getAreaByName, updateArea } from "../controllers/area.controller";

const router = Router();

/**
 * @swagger
 * /area:
 *   get:
 *     tags:
 *       - Area
 *     summary: Obtener todas las áreas
 *     description: Endpoint para obtener todas las áreas registradas en el sistema.
 *     responses:
 *       200:
 *         description: Lista de áreas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.get("/area", authenticate, authorizeRoles(["1"]), getAllAreas);

/**
 * @swagger
 * /area/name:
 *   post:
 *     tags:
 *       - Area
 *     summary: Buscar área por nombre
 *     description: Endpoint para buscar un área por su nombre.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del área a buscar.
 *     responses:
 *       200:
 *         description: Área encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       404:
 *         description: Área no encontrada.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.post("/area/name", authenticate, authorizeRoles(["1"]), getAreaByName);

/**
 * @swagger
 * /area:
 *   post:
 *     tags:
 *       - Area
 *     summary: Crear una nueva área
 *     description: Endpoint para crear una nueva área en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del área.
 *     responses:
 *       201:
 *         description: Área creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         description: Error en la solicitud.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.post("/area", authenticate, authorizeRoles(["1"]), createArea);

/**
 * @swagger
 * /area/{id}:
 *   put:
 *     tags:
 *       - Area
 *     summary: Actualizar un área
 *     description: Endpoint para actualizar un área existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del área a actualizar.
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
 *                 description: Nombre del área.
 *     responses:
 *       200:
 *         description: Área actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Área no encontrada.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.put("/area/:id", authenticate, authorizeRoles(["1"]), updateArea);

export default router;