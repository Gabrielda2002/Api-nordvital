import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createAccessory, deleteAccessory, getAccessory, getAllAccessories, updateAccessory } from "../controllers/accesorios-equipos_controller";
import { validarId } from "../middlewares/validar-id";
import { generateInventoryNumber } from "../middlewares/generate-inventory-number";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Accesorio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         equipmentId:
 *           type: integer
 *         name:
 *           type: string
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         serial:
 *           type: string
 *         otherData:
 *           type: string
 *         status:
 *           type: string
 *         inventoryNumber:
 *           type: string
 */

/**
 * @swagger
 * /accesorios-equipos:
 *   get:
 *     summary: Obtiene todos los accesorios
 *     tags: [Accesorios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de accesorios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Accesorio' 
 *       404:
 *         description: No se encontraron accesorios
 *       401:
 *         description: No autorizado
 */
router.get("/accesorios-equipos", authenticate, authorizeRoles(['1']), getAllAccessories);

/**
 * @swagger
 * /accesorios-equipos/{id}:
 *   get:
 *     summary: Obtiene un accesorio por ID
 *     tags: [Accesorios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del accesorio
 *     responses:
 *       200:
 *         description: Accesorio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Accesorio'
 *       404:
 *         description: Accesorio no encontrado
 */
router.get("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']), validarId, getAccessory);

/**
 * @swagger
 * /accesorios-equipos:
 *   post:
 *     summary: Crea un nuevo accesorio
 *     tags: [Accesorios]
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
 *               - equipmentId
 *             properties:
 *               equipmentId:
 *                 type: integer
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               serial:
 *                 type: string
 *               otherData:
 *                 type: string
 *               status:
 *                 type: string
 *               inventoryNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Accesorio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Accesorio'
 *       400:
 *         description: Error de validación
 */
router.post("/accesorios-equipos", authenticate, authorizeRoles(['1']), createAccessory);

/**
 * @swagger
 * /accesorios-equipos/{id}:
 *   put:
 *     summary: Actualiza un accesorio
 *     tags: [Accesorios]
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
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               serial:
 *                 type: string
 *               otherData:
 *                 type: string
 *               status:
 *                 type: string
 *               inventoryNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Accesorio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Accesorio'
 *       404:
 *         description: Accesorio no encontrado
 *       400:
 *         description: Error de validación
 */
router.put("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']), generateInventoryNumber, validarId, updateAccessory);

/**
 * @swagger
 * /accesorios-equipos/{id}:
 *   delete:
 *     summary: Elimina un accesorio
 *     tags: [Accesorios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accesorio eliminado exitosamente
 */
router.delete("/accesorios-equipos/:id", authenticate, authorizeRoles(['1']), validarId, deleteAccessory);

export default router;