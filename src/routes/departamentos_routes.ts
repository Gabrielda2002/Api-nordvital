import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartment, updateDepartment } from "../controllers/departamentos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * /departamentos:
 *   get:
 *     tags:
 *       - Departamentos
 *     summary: Obtiene todos los departamentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       404:
 *         description: No se encontraron departamentos
 */
router.get("/departamentos", authenticate, authorizeRoles(['1']), getAllDepartments)

/**
 * @swagger
 * /departamentos/{id}:
 *   get:
 *     tags:
 *       - Departamentos
 *     summary: Obtiene un departamento por ID
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
 *         description: Departamento encontrado
 *       404:
 *         description: Departamento no encontrado
 */
router.get("/departamentos/:id", authenticate, authorizeRoles(['1']), validarId, getDepartment)

/**
 * @swagger
 * /departamentos:
 *   post:
 *     tags:
 *       - Departamentos
 *     summary: Crea un nuevo departamento
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
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Departamento creado
 *       400:
 *         description: El departamento ya existe o datos inválidos
 */
router.post("/departamentos", authenticate, authorizeRoles(['1']), createDepartment)

/**
 * @swagger
 * /departamentos/{id}:
 *   put:
 *     tags:
 *       - Departamentos
 *     summary: Actualiza un departamento
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
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Departamento actualizado
 *       404:
 *         description: Departamento no encontrado
 */
router.put("/departamentos/:id", authenticate, authorizeRoles(['1']), validarId, updateDepartment)

/**
 * @swagger
 * /departamentos/{id}:
 *   delete:
 *     tags:
 *       - Departamentos
 *     summary: Elimina un departamento
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
 *         description: Departamento eliminado
 *       404:
 *         description: Departamento no encontrado
 */
router.delete("/departamentos/:id", authenticate, authorizeRoles(['1']), validarId, deleteDepartment)

export default router;