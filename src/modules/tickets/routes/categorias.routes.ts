import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categorias.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /categorias:
 *   post:
 *     tags:
 *       - Categorias
 *     summary: Obtener todas las categorías
 *     description: Endpoint para obtener todas las categorías.
 *     responses:
 *       200:
 *         description: Lista de categorías.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categorias'
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.post('/categories/:type', authenticate, authorizeRoles(ROLE_GROUPS.ALL), getAllCategories);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Obtener una categoría por ID
 *     description: Endpoint para obtener una categoría por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorias'
 *       404:
 *         description: Categoría no encontrada.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.get('/categorias/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getCategoryById);

/**
 * @swagger
 * /categorias:
 *   post:
 *     tags:
 *       - Categorias
 *     summary: Crear una nueva categoría
 *     description: Endpoint para crear una nueva categoría.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría.
 *     responses:
 *       201:
 *         description: Categoría creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorias'
 *       400:
 *         description: Error en la solicitud.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.post('/categorias', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), createCategory);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     tags:
 *       - Categorias
 *     summary: Actualizar una categoría
 *     description: Endpoint para actualizar una categoría existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría.
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
 *                 description: Nombre de la categoría.
 *     responses:
 *       200:
 *         description: Categoría actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorias'
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Categoría no encontrada.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.put('/categorias/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, updateCategory);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     tags:
 *       - Categorias
 *     summary: Eliminar una categoría
 *     description: Endpoint para eliminar una categoría existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada.
 *       404:
 *         description: Categoría no encontrada.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Prohibido.
 */
router.delete('/categorias/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteCategory);

export default router;
