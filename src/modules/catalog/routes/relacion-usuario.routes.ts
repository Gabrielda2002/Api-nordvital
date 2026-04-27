import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
import { getAllRelationUser, getRelationUserByName } from "../controllers/relacion-usuario.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RelacionUsuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la relación usuario
 *         name:
 *           type: string
 *           description: Nombre de la relación usuario
 */

/**
 * @swagger
 * /relacion/demanda-inducida:
 *   get:
 *     summary: Obtiene todas las relaciones de usuario para demanda inducida
 *     security:
 *       - bearerAuth: []
 *     tags: [Relaciones Usuario]
 *     responses:
 *       200:
 *         description: Lista de relaciones de usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RelacionUsuario'
 *       404:
 *         description: No se encontraron relaciones de usuario
 */
router.get("/relacion/demanda-inducida", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllRelationUser);

/**
 * @swagger
 * /relacion/demanda-inducida/buscar:
 *   post:
 *     summary: Busca relaciones de usuario por nombre
 *     security:
 *       - bearerAuth: []
 *     tags: [Relaciones Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la relación a buscar (usar "@" para obtener primeros 100 registros)
 *     responses:
 *       200:
 *         description: Relaciones de usuario encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RelacionUsuario'
 *       404:
 *         description: No se encontraron relaciones de usuario
 */
router.post("/relacion/demanda-inducida/buscar", authenticate, authorizeRoles(ROLE_GROUPS.ADMIN_NURSING), getRelationUserByName);

export default router;