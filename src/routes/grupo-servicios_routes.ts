import { Router } from "express";
import { createGrupoServicios, deleteGrupoServicios, getAllGruposServicios, getGrupoServicios, getGrupoServiciosByName, updateGrupoServicios } from "../controllers/grupo-servicios.controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /grupo-servicios:
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
router.get("/grupo-servicios", authenticate, authorizeRoles(['1', '2']), getAllGruposServicios);

/**
 * @swagger
 * /grupo-servicios/{id}:
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
router.get("/grupo-servicios/:id", authenticate, authorizeRoles(['1', '2']), validarId, getGrupoServicios);

/**
 * @swagger
 * /grupo-servicios:
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
router.post("/grupo-servicios", authenticate, authorizeRoles(['1', '2']), createGrupoServicios);

/**
 * @swagger
 * /grupo-servicios/{id}:
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
router.put("/grupo-servicios/:id", validarId, authenticate, authorizeRoles(['1', '2']), updateGrupoServicios);

/**
 * @swagger
 * /grupo-servicios/{id}:
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
router.delete("/grupo-servicios/:id", validarId, authenticate, authorizeRoles(['1']), deleteGrupoServicios);

/**
 * @swagger
 * /grupo-servicios-name:
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
router.post("/grupo-servicios-name", authenticate, authorizeRoles(['1', '3', '10', '15', '6']), getGrupoServiciosByName);

export default router;