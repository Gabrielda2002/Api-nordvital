import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import {
    getAllSstCategories,
    getSstCategoryById,
    createSstCategory,
    updateSstCategory,
    deleteSstCategory,
} from "../controllers/sst-categories.controller";

const router = Router();

/**
 * @swagger
 * /sst-categories:
 *   get:
 *     summary: Obtener categorías de SST
 *     tags: [SstCategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-categories", authenticate, authorizeRoles(ROLE_GROUPS.ALL), getAllSstCategories);

/**
 * @swagger
 * /sst-categories/{id}:
 *   get:
 *     summary: Obtener una categoría de SST por ID
 *     tags: [SstCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sst-categories/:id", authenticate, authorizeRoles(ROLE_GROUPS.ALL), validarId, getSstCategoryById);

/**
 * @swagger
 * /sst-categories:
 *   post:
 *     summary: Crear una categoría de SST
 *     tags: [SstCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               priorityId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Categoría creada
 *       409:
 *         description: Ya existe una categoría con ese nombre
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sst-categories", authenticate, authorizeRoles(ROLE_GROUPS.SST_ADMIN), createSstCategory);

/**
 * @swagger
 * /sst-categories/{id}:
 *   put:
 *     summary: Actualizar una categoría de SST
 *     tags: [SstCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/sst-categories/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_ADMIN), validarId, updateSstCategory);

/**
 * @swagger
 * /sst-categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría de SST
 *     tags: [SstCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/sst-categories/:id", authenticate, authorizeRoles(ROLE_GROUPS.SST_ADMIN), validarId, deleteSstCategory);

export default router;
