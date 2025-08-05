import { Router } from "express";
import { createDiagnostico, deleteDiagnostico, getAllDiagnosticos, getDiagnosticoById, getDiagnosticosByName, updateDiagnostico } from "../controllers/diagnostico.controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /diagnosticos:
 *   get:
 *     summary: Obtiene todos los diagnósticos
 *     tags: [Diagnósticos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de diagnósticos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   code:
 *                     type: string
 *                   description:
 *                     type: string
 *       404:
 *         description: No se encontraron diagnósticos
 */
router.get("/diagnosticos", authenticate, authorizeRoles(['1', '2']), getAllDiagnosticos);

/**
 * @swagger
 * /diagnosticos/{id}:
 *   get:
 *     summary: Obtiene un diagnóstico por ID
 *     tags: [Diagnósticos]
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
 *         description: Diagnóstico encontrado
 *       404:
 *         description: Diagnóstico no encontrado
 */
router.get("/diagnosticos/:id", authenticate, authorizeRoles(['1', '2']), validarId, getDiagnosticoById);

/**
 * @swagger
 * /diagnosticos:
 *   post:
 *     summary: Crea un nuevo diagnóstico
 *     tags: [Diagnósticos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - code
 *               - name
 *     responses:
 *       201:
 *         description: Diagnóstico creado exitosamente
 *       409:
 *         description: El diagnóstico ya existe
 */
router.post("/diagnosticos", authenticate, authorizeRoles(['1', '2']), createDiagnostico);

/**
 * @swagger
 * /diagnosticos/{id}:
 *   put:
 *     summary: Actualiza un diagnóstico existente
 *     tags: [Diagnósticos]
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
 *         description: Diagnóstico actualizado exitosamente
 *       404:
 *         description: Diagnóstico no encontrado
 */
router.put("/diagnosticos/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateDiagnostico);

/**
 * @swagger
 * /diagnosticos/{id}:
 *   delete:
 *     summary: Elimina un diagnóstico
 *     tags: [Diagnósticos]
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
 *         description: Diagnóstico eliminado exitosamente
 *       404:
 *         description: Diagnóstico no encontrado
 */
router.delete("/diagnosticos/:id", authenticate, authorizeRoles(['1']), validarId, deleteDiagnostico);

/**
 * @swagger
 * /diagnosticos-name:
 *   post:
 *     summary: Busca diagnósticos por código
 *     tags: [Diagnósticos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: Diagnósticos encontrados
 *       404:
 *         description: No se encontraron diagnósticos
 */
router.post("/diagnosticos-name", authenticate, authorizeRoles(['1', '3', '10', '15', '6']), getDiagnosticosByName);

export default router;