import { Router } from "express";
import { createServicio, deleteServicio, getAllServicios, getServicioById, getServiciosByName, updateServicio, updateStatusServicio } from "../controllers/servicio_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router(); 

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtiene todos los servicios
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: No se encontraron servicios
 */
router.get("/servicios", authenticate, authorizeRoles(['1', '2']), getAllServicios)

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtiene un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado
 */
router.get("/servicios/:id", authenticate, authorizeRoles(['1', '2']), validarId, getServicioById)

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Servicio creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/servicios", authenticate, authorizeRoles(['1', '2']), createServicio)

/**
 * @swagger
 * /servicios/{id}:
 *   put:
 *     summary: Actualiza un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *       404:
 *         description: Servicio no encontrado
 */
router.put("/servicios/:id", authenticate, authorizeRoles(['1', '2']), validarId, updateServicio)

/**
 * @swagger
 * /servicios/{id}:
 *   delete:
 *     summary: Elimina un servicio
 *     tags: [Servicios]
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
 *         description: Servicio eliminado
 *       404:
 *         description: Servicio no encontrado
 */
router.delete("/servicios/:id", authenticate, authorizeRoles(['1']), validarId, deleteServicio)

/**
 * @swagger
 * /servicios-name:
 *   post:
 *     summary: Busca servicios por nombre
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lista de servicios encontrados
 *       400:
 *         description: Nombre no proporcionado
 */
router.post("/servicios-name", authenticate, authorizeRoles(['1', '3', '10', '15', '6']), getServiciosByName)

/**
 * @swagger
 * /update-status-servicio/{id}:
 *   put:
 *     summary: Actualiza el estado o nombre de un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado del servicio actualizado
 *       404:
 *         description: Servicio no encontrado
 */
router.put("/update-status-servicio/:id", validarId, authenticate, authorizeRoles(['1', '2']), updateStatusServicio);

export default router;