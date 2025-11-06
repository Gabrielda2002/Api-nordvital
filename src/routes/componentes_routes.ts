import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createComponent, deleteComponent, getAllComponents, getComponent, updateComponent } from "../controllers/componentes.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Componente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del componente
 *         idEquipments:
 *           type: integer
 *           description: ID del equipo al que pertenece
 *         name:
 *           type: string
 *           description: Nombre del componente
 *         brand:
 *           type: string
 *           description: Marca del componente
 *         capacity:
 *           type: string
 *           description: Capacidad del componente
 *         speed:
 *           type: string
 *           description: Velocidad del componente
 *         otherData:
 *           type: string
 *           description: Datos adicionales
 *         model:
 *           type: string
 *           description: Modelo del componente
 *         serial:
 *           type: string
 *           description: Número de serie
 */

/**
 * @swagger
 * /componentes:
 *   get:
 *     summary: Obtiene todos los componentes
 *     tags: [Componentes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de componentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Componente'
 *       404:
 *         description: No se encontraron componentes
 */
router.get("/componentes", authenticate, authorizeRoles(["1"]), getAllComponents);

/**
 * @swagger
 * /componentes/{id}:
 *   get:
 *     summary: Obtiene un componente por ID
 *     tags: [Componentes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del componente
 *     responses:
 *       200:
 *         description: Componente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Componente'
 *       404:
 *         description: Componente no encontrado
 */
router.get("/componentes/:id", authenticate, authorizeRoles(["1"]),validarId ,getComponent);

/**
 * @swagger
 * /componentes:
 *   post:
 *     summary: Crea un nuevo componente
 *     tags: [Componentes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipmentId:
 *                 type: integer
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               capacity:
 *                 type: string
 *               speed:
 *                 type: string
 *               otherData:
 *                 type: string
 *               model:
 *                 type: string
 *               serial:
 *                 type: string
 *     responses:
 *       200:
 *         description: Componente creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Componente'
 *       400:
 *         description: Datos inválidos
 */
router.post("/componentes", authenticate, authorizeRoles(["1"]), createComponent);

/**
 * @swagger
 * /componentes/{id}:
 *   put:
 *     summary: Actualiza un componente
 *     tags: [Componentes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del componente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Componente'
 *     responses:
 *       200:
 *         description: Componente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Componente'
 *       404:
 *         description: Componente no encontrado
 */
router.put("/componentes/:id", authenticate, authorizeRoles(["1"]), validarId, updateComponent);

/**
 * @swagger
 * /componentes/{id}:
 *   delete:
 *     summary: Elimina un componente
 *     tags: [Componentes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del componente
 *     responses:
 *       200:
 *         description: Componente eliminado
 *       404:
 *         description: Componente no encontrado
 */
router.delete("/componentes/:id", authenticate, authorizeRoles(["1"]), validarId, deleteComponent);

export default router;