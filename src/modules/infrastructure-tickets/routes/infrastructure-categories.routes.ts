import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import {
    getAllInfrastructureCategories,
    getInfrastructureCategoryById,
    createInfrastructureCategory,
    updateInfrastructureCategory,
    deleteInfrastructureCategory,
} from "../controllers/infrastructure-categories.controller";

const INFRA_MANAGEMENT = ['1', '22', '23'];
const INFRA_ADMIN = ['1', '22'];

const router = Router();

/**
 * @swagger
 * /infrastructure-categories:
 *   post:
 *     summary: Buscar o listar categorías de infraestructura
 *     tags: [InfrastructureCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Filtro por nombre (dejar en "@" para listar todas)
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       500:
 *         description: Error interno del servidor
 */
router.post("/infrastructure-categories", authenticate, authorizeRoles(INFRA_MANAGEMENT), getAllInfrastructureCategories);

/**
 * @swagger
 * /infrastructure-categories/{id}:
 *   get:
 *     summary: Obtener una categoría de infraestructura por ID
 *     tags: [InfrastructureCategories]
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
router.get("/infrastructure-categories/:id", authenticate, authorizeRoles(INFRA_MANAGEMENT), validarId, getInfrastructureCategoryById);

/**
 * @swagger
 * /infrastructure-categories/create:
 *   post:
 *     summary: Crear una nueva categoría de infraestructura
 *     tags: [InfrastructureCategories]
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
router.post("/infrastructure-categories/create", authenticate, authorizeRoles(INFRA_ADMIN), createInfrastructureCategory);

/**
 * @swagger
 * /infrastructure-categories/{id}:
 *   put:
 *     summary: Actualizar una categoría de infraestructura
 *     tags: [InfrastructureCategories]
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
router.put("/infrastructure-categories/:id", authenticate, authorizeRoles(INFRA_ADMIN), validarId, updateInfrastructureCategory);

/**
 * @swagger
 * /infrastructure-categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría de infraestructura
 *     tags: [InfrastructureCategories]
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
router.delete("/infrastructure-categories/:id", authenticate, authorizeRoles(INFRA_ADMIN), validarId, deleteInfrastructureCategory);

export default router;
