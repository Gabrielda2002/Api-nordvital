import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartment, updateDepartment } from "../controllers/departamentos.controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Departamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del departamento
 *         name:
 *           type: string
 *           description: Nombre del departamento
 *         code:
 *           type: integer
 *           description: Código del departamento
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       required:
 *         - name
 *   responses:
 *     DepartamentoNotFound:
 *       description: Departamento no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Departamento no encontrado
 */

/**
 * @swagger
 * /departamentos:
 *   get:
 *     tags:
 *       - Departamentos
 *     summary: Obtiene todos los departamentos
 *     description: Retorna un listado de todos los departamentos registrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de departamentos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Departamento'
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 *       500:
 *         description: Error interno del servidor
 */
router.get("/departamentos", authenticate, authorizeRoles(['1', '6', '4']), getAllDepartments)

/**
 * @swagger
 * /departamentos/{id}:
 *   get:
 *     tags:
 *       - Departamentos
 *     summary: Obtiene un departamento por ID
 *     description: Retorna un departamento específico según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del departamento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departamento encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Departamento'
 *       404:
 *         $ref: '#/components/responses/DepartamentoNotFound'
 */
router.get("/departamentos/:id", authenticate, authorizeRoles(['1']), validarId, getDepartment)

/**
 * @swagger
 * /departamentos:
 *   post:
 *     tags:
 *       - Departamentos
 *     summary: Crea un nuevo departamento
 *     description: Crea un nuevo departamento con los datos proporcionados
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
 *                 description: Nombre del departamento
 *                 example: "Antioquia"
 *               code:
 *                 type: integer
 *                 description: Código del departamento
 *                 example: 5
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Departamento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Departamento'
 *       400:
 *         description: Datos inválidos o departamento ya existe
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos suficientes
 */
router.post("/departamentos", authenticate, authorizeRoles(['1']), createDepartment)

/**
 * @swagger
 * /departamentos/{id}:
 *   put:
 *     tags:
 *       - Departamentos
 *     summary: Actualiza un departamento
 *     description: Actualiza los datos de un departamento existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del departamento a actualizar
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
 *                 description: Nuevo nombre del departamento
 *                 example: "Antioquia"
 *               code:
 *                 type: integer
 *                 description: Nuevo código del departamento
 *                 example: 5
 *     responses:
 *       200:
 *         description: Departamento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Departamento'
 *       404:
 *         $ref: '#/components/responses/DepartamentoNotFound'
 */
router.put("/departamentos/:id", authenticate, authorizeRoles(['1']), validarId, updateDepartment)

/**
 * @swagger
 * /departamentos/{id}:
 *   delete:
 *     tags:
 *       - Departamentos
 *     summary: Elimina un departamento
 *     description: Elimina un departamento existente según su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del departamento a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departamento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Departamento eliminado
 *       404:
 *         $ref: '#/components/responses/DepartamentoNotFound'
 */
router.delete("/departamentos/:id", authenticate, authorizeRoles(['1']), validarId, deleteDepartment)

export default router;