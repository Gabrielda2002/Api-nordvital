import { Router } from "express";
import { createServicioSolicitado, deleteServicioSolicitado, getAllServiciosSolicitados, getServicioSolicitado, getServiciosSolicitadosByCode, updateServicioSolicitado, updateServicioSolicitadoTable } from "../controllers/servicio-solicitado_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /servicio-solicitado:
 *   get:
 *     summary: Obtiene todos los servicios solicitados
 *     tags: [Servicios Solicitados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios solicitados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServicioSolicitado'
 *       401:
 *         description: No autorizado
 */
router.get("/servicio-solicitado",authenticate, authorizeRoles(['1', '2', '5']), getAllServiciosSolicitados);

/**
 * @swagger
 * /servicio-solicitado/{id}:
 *   get:
 *     summary: Obtiene un servicio solicitado por ID
 *     tags: [Servicios Solicitados]
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
 *         description: Servicio solicitado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicioSolicitado'
 *       404:
 *         description: Servicio solicitado no encontrado
 *
router.get("/servicio-solicitado/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,getServicioSolicitado);

/**
 * @swagger
 * /servicio-solicitado:
 *   post:
 *     summary: Crea un nuevo servicio solicitado
 *     tags: [Servicios Solicitados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioSolicitado'
 *     responses:
 *       200:
 *         description: Servicio solicitado creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/servicio-solicitado",authenticate, authorizeRoles(['1', '2', '5']), createServicioSolicitado);

/**
 * @swagger
 * /servicio-solicitado/{id}:
 *   put:
 *     summary: Actualiza un servicio solicitado
 *     tags: [Servicios Solicitados]
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
 *             $ref: '#/components/schemas/ServicioSolicitado'
 *     responses:
 *       200:
 *         description: Servicio solicitado actualizado
 *       404:
 *         description: Servicio solicitado no encontrado
 */
router.put("/servicio-solicitado/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,updateServicioSolicitado);

/**
 * @swagger
 * /servicio-solicitado/{id}:
 *   delete:
 *     summary: Elimina un servicio solicitado
 *     tags: [Servicios Solicitados]
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
 *         description: Servicio solicitado eliminado
 *       404:
 *         description: Servicio solicitado no encontrado
 */
router.delete("/servicio-solicitado/:id",authenticate, authorizeRoles(['1']), validarId ,deleteServicioSolicitado);

/**
 * @swagger
 * /servicio-solicitado-code:
 *   post:
 *     summary: Busca servicios solicitados por código
 *     tags: [Servicios Solicitados]
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
 *     responses:
 *       200:
 *         description: Servicio solicitado encontrado
 *       404:
 *         description: Servicio solicitado no encontrado
 */
router.post("/servicio-solicitado-code",authenticate, authorizeRoles(['1', '3', '10', '15', '6']), getServiciosSolicitadosByCode);

/**
 * @swagger
 * /servicio-solicitado-update-table/{id}:
 *   put:
 *     summary: Actualiza campos específicos de un servicio solicitado
 *     tags: [Servicios Solicitados]
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Servicio solicitado actualizado
 *       404:
 *         description: Servicio solicitado no encontrado
 */
router.put("/servicio-solicitado-update-table/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,updateServicioSolicitadoTable);

export default router;