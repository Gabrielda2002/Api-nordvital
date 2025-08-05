import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { validarId } from "../middlewares/validar-id";
import { createSoftware, deleteSoftware, getAllSoftware, getSoftware, updateSoftware } from "../controllers/software.controller";

const router = Router();

/**
 * @swagger
 * /software:
 *   get:
 *     summary: Obtiene lista de todo el software
 *     tags: [Software]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de software obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Software'
 *       404:
 *         description: No se encontró software
 */
router.get("/software", authenticate, authorizeRoles(["1"]), getAllSoftware);

/**
 * @swagger
 * /software/{id}:
 *   get:
 *     summary: Obtiene un software por ID
 *     tags: [Software]
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
 *         description: Software encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Software'
 *       404:
 *         description: Software no encontrado
 */
router.get("/software/:id", authenticate, authorizeRoles(["1"]),validarId , getSoftware);

/**
 * @swagger
 * /software:
 *   post:
 *     summary: Crea un nuevo software
 *     tags: [Software]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Software'
 *     responses:
 *       200:
 *         description: Software creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/software", authenticate, authorizeRoles(["1"]), createSoftware);

/**
 * @swagger
 * /software/{id}:
 *   put:
 *     summary: Actualiza un software existente
 *     tags: [Software]
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
 *             $ref: '#/components/schemas/Software'
 *     responses:
 *       200:
 *         description: Software actualizado exitosamente
 *       404:
 *         description: Software no encontrado
 */
router.put("/software/:id", authenticate, authorizeRoles(["1"]), validarId, updateSoftware);

/**
 * @swagger
 * /software/{id}:
 *   delete:
 *     summary: Elimina un software
 *     tags: [Software]
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
 *         description: Software eliminado exitosamente
 *       404:
 *         description: Software no encontrado
 */
router.delete("/software/:id", authenticate, authorizeRoles(["1"]), validarId, deleteSoftware);

export default router;