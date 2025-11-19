import { Router } from "express";
import { createPosition, getAllPosition, getPositionByName, updatePosition } from "../controllers/cargo.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";

const router = Router();

/**
 * @swagger
 * /cargo:
 *   get:
 *     tags:
 *       - Cargo
 *     summary: Obtener todos los cargos
 *     description: Endpoint para obtener todos los cargos registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de cargos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cargo'
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.get("/cargo", authenticate, authorizeRoles(["1"]), getAllPosition);

/**
 * @swagger
 * /cargo/name:
 *   post:
 *     tags:
 *       - Cargo
 *     summary: Buscar cargo por nombre
 *     description: Endpoint para buscar un cargo por su nombre.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del cargo a buscar.
 *     responses:
 *       200:
 *         description: Cargo encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cargo'
 *       404:
 *         description: Cargo no encontrado.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.post("/cargo/name", authenticate, authorizeRoles(["1","18"]), getPositionByName);

/**
 * @swagger
 * /cargo:
 *   post:
 *     tags:
 *       - Cargo
 *     summary: Crear un nuevo cargo
 *     description: Endpoint para crear un nuevo cargo en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del cargo.
 *     responses:
 *       201:
 *         description: Cargo creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cargo'
 *       400:
 *         description: Error en la solicitud.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.post("/cargo", authenticate, authorizeRoles(["1"]), createPosition);

/**
 * @swagger
 * /cargo/{id}:
 *   put:
 *     tags:
 *       - Cargo
 *     summary: Actualizar un cargo
 *     description: Endpoint para actualizar un cargo existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del cargo a actualizar.
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
 *                 description: Nombre del cargo.
 *     responses:
 *       200:
 *         description: Cargo actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cargo'
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Cargo no encontrado.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.put("/cargo/:id", authenticate, authorizeRoles(["1"]), updatePosition);

export default router;