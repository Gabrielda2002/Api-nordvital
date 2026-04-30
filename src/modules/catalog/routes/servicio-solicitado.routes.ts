import { Router } from "express";
import { createServicioSolicitado, deleteServicioSolicitado, getAllServiciosSolicitados, getServicioSolicitado, getServiciosSolicitadosByCode, updateServicioSolicitado, updateServicioSolicitadoTable } from "../controllers/servicio-solicitado.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

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
router.get("/servicio-solicitado",authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUXILIAR]), getAllServiciosSolicitados);

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
 */
router.get("/servicio-solicitado/:id",authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUXILIAR]), validarId ,getServicioSolicitado);

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
router.post("/servicio-solicitado",authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUXILIAR]), createServicioSolicitado);

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
router.put("/servicio-solicitado/:id",authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUXILIAR]), validarId ,updateServicioSolicitado);

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
router.delete("/servicio-solicitado/:id",authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId ,deleteServicioSolicitado);

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
router.post("/servicio-solicitado-code",authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA]), getServiciosSolicitadosByCode);

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
router.put("/servicio-solicitado-update-table/:id",authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUXILIAR]), validarId ,updateServicioSolicitadoTable);

export default router;