import { Router } from "express";
import { createLugarRadicacion, deleteLugarRadicacion, getAllLugaresRadicacion, getHeadquartersList, getLugaresRadicacionByDepartment, getLugaresRadicacionByName, getLugarRadicacion, updateHeadquarters } from "../controllers/sedes.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /headquarters:
 *   get:
 *     summary: Obtiene todas las sedes
 *     tags: [Lugares de Radicación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sedes con municipio, departamento y código de habilitación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SedesListItem'
 *       404:
 *         description: No se encontraron sedes
 */
router.get("", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT_HR), getAllLugaresRadicacion);

/**
 * @swagger
 * /headquarters/headquarters:
 *   get:
 *     summary: Obtiene el listado básico de sedes (id y nombre)
 *     description: Endpoint público, no requiere autenticación.
 *     tags: [Lugares de Radicación]
 *     responses:
 *       200:
 *         description: Lista básica de sedes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la sede
 *                   name:
 *                     type: string
 *                     description: Nombre de la sede
 */
router.get("/headquarters", getHeadquartersList);

/**
 * @swagger
 * /headquarters/{id}:
 *   get:
 *     summary: Obtiene una sede por ID
 *     tags: [Lugares de Radicación]
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
 *         description: Sede encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sedes'
 *       404:
 *         description: Sede no encontrada
 */
router.get("/:id", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), validarId, getLugarRadicacion);

/**
 * @swagger
 * /headquarters:
 *   post:
 *     summary: Crea una sede
 *     tags: [Lugares de Radicación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SedesRequest'
 *     responses:
 *       200:
 *         description: Sede creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sedes'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe una sede con ese nombre
 */
router.post("", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), createLugarRadicacion);

/**
 * @swagger
 * /headquarters/lugares-radicacion-name:
 *   post:
 *     summary: Busca sedes por nombre
 *     tags: [Lugares de Radicación]
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
 *                 description: Texto a buscar en el nombre; use "@" para listar las primeras 100 sedes
 *     responses:
 *       200:
 *         description: Sedes encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sedes'
 *       404:
 *         description: No se encontraron sedes
 */
router.post("/name", authenticate, authorizeRoles(ROLE_GROUPS.ALL), getLugaresRadicacionByName);

/**
 * @swagger
 * /headquarters/{id}:
 *   put:
 *     summary: Actualiza una sede
 *     tags: [Lugares de Radicación]
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
 *             $ref: '#/components/schemas/SedesRequest'
 *     responses:
 *       200:
 *         description: Sede actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sedes'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Sede no encontrada
 */
router.put("/:id", authenticate, authorizeRoles(ROLE_GROUPS.MANAGEMENT), validarId, updateHeadquarters);

/**
 * @swagger
 * /headquarters/lugares-radicacion/{id}:
 *   delete:
 *     summary: Elimina una sede
 *     tags: [Lugares de Radicación]
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
 *         description: Sede eliminada
 *       400:
 *         description: La sede tiene registros asociados y no se puede eliminar
 *       404:
 *         description: Sede no encontrada
 */
router.delete("/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteLugarRadicacion);

/**
 * @swagger
 * /headquarters/sede/departamento/{id}:
 *   get:
 *     summary: Obtiene las sedes de un departamento
 *     tags: [Lugares de Radicación]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Lista de sedes del departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sedes'
 *       404:
 *         description: No se encontraron sedes
 */
router.get("/department/:id", authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_FULL), validarId, getLugaresRadicacionByDepartment);

export default router;
