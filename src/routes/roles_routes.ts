import { Router } from "express";
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from "../controllers/roles_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del rol
 *         name:
 *           type: string
 *           description: Nombre del rol
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: No autorizado
 */
router.get("/roles",authenticate, authorizeRoles(['1', '2']), getAllRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 */
router.get("/roles/:id",authenticate, authorizeRoles(['1', '2']), validarId ,getRole);

/**
 * @swagger
 * /roles:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
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
 *                 description: Nombre del rol
 *     responses:
 *       200:
 *         description: Rol creado exitosamente
 *       400:
 *         description: Error en la creación del rol
 */
router.post("/roles",authenticate, authorizeRoles(['1', '2']), createRole);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Actualiza un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
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
 *                 description: Nuevo nombre del rol
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.put("/roles/:id",authenticate, authorizeRoles(['1']), validarId ,updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Elimina un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.delete("/roles/:id",authenticate, authorizeRoles(['1']), validarId ,deleteRole);

export default router;