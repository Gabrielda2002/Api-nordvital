import { Router } from "express";
import { createGrupoServicios, deleteGrupoServicios, getAllGruposServicios, getGrupoServicios, getGrupoServiciosByName, updateByRadicacion, updateGrupoServicios } from "../controllers/grupo-servicios.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /group-services:
 *   get:
 *     summary: Obtiene todos los grupos de servicios
 *     tags: [Grupo de Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos de servicios obtenida exitosamente
 *       401:
 *         description: No autorizado
 */
router.get("/", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), getAllGruposServicios);

/**
 * @swagger
 * /group-services/{id}:
 *   get:
 *     summary: Obtiene un grupo de servicios por ID
 *     tags: [Grupo de Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de servicios
 *     responses:
 *       200:
 *         description: Grupo de servicios encontrado
 *       404:
 *         description: Grupo de servicios no encontrado
 */
router.get("/:id", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), validarId, getGrupoServicios);

/**
 * @swagger
 * /group-services:
 *   post:
 *     summary: Crea un nuevo grupo de servicios
 *     tags: [Grupo de Servicios]
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
 *                 description: Nombre del grupo de servicios
 *     responses:
 *       201:
 *         description: Grupo de servicios creado exitosamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), createGrupoServicios);

/**
 * @swagger
 * /group-services/{id}:
 *   put:
 *     summary: Actualiza un grupo de servicios
 *     tags: [Grupo de Servicios]
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
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Grupo de servicios actualizado exitosamente
 *       404:
 *         description: Grupo de servicios no encontrado
 */
router.put("/:id", validarId, authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), updateGrupoServicios);

/**
 * @swagger
 * /group-services/{id}:
 *   delete:
 *     summary: Elimina un grupo de servicios
 *     tags: [Grupo de Servicios]
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
 *         description: Grupo de servicios eliminado exitosamente
 *       404:
 *         description: Grupo de servicios no encontrado
 */
router.delete("/:id", validarId, authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), deleteGrupoServicios);

/**
 * @swagger
 * /group-services/name:
 *   post:
 *     summary: Busca grupos de servicios por nombre
 *     tags: [Grupo de Servicios]
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
 *                 description: Nombre o parte del nombre a buscar
 *     responses:
 *       200:
 *         description: Grupos de servicios encontrados
 *       404:
 *         description: No se encontraron grupos de servicios
 */
router.post("/name", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.AUDITOR, ROLE_IDS.RADICADOR, ROLE_IDS.CIRUGIA, ROLE_IDS.COORDINADOR]), getGrupoServiciosByName);

/**
 * @swagger
 * /group-services/{id}/radicacion:
 *   put:
 *     tags:
 *       - [Grupo de Servicios]
 *     summary: Actualiza el grupo de servicios de una radicación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la radicación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupServices
 *             properties:
 *               groupServices:
 *                 type: integer
 *                 description: ID del nuevo grupo de servicios
 *     responses:
 *       200:
 *         description: Grupo de servicios actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Radicacion updated"
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Radicación no encontrada
 */
router.put('/:id/radicacion', authenticate, authorizeRoles(ROLE_GROUPS.SURGERY_AUDIT), validarId, updateByRadicacion);

export default router;