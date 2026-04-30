import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createInventoryGeneral, getAllInventarioGeneral, getAllInventoryGeneralByHeadquarters, getInventoryGeneralAgeStatistics, getInventoryGeneralByHeadquartersStatistics, getInvetoryGeneralWarrantyStatitics, searchInventoryGeneral, updateInventoryGeneral } from "../controllers/inventario-general.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /general/inventory:
 *   get:
 *     summary: Obtener todos los registros del inventario general
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros del inventario general.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventarioGeneral'
 *       404:
 *         description: No se encontraron registros.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllInventarioGeneral);

/**
 * @swagger
 * /general/inventory/sede/{id}:
 *   get:
 *     summary: Obtener registros del inventario general por sede
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la sede
 *     responses:
 *       200:
 *         description: Lista de registros del inventario general por sede.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventarioGeneral'
 *       404:
 *         description: No se encontraron registros.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/sede/:id', authenticate, authorizeRoles(ROLE_GROUPS.INVENTORY_FULL), getAllInventoryGeneralByHeadquarters);

/**
 * @swagger
 * /general/inventory:
 *   post:
 *     summary: Crear un nuevo registro en el inventario general
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioGeneral'
 *     responses:
 *       201:
 *         description: Registro creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioGeneral'
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.SOPORTE]), createInventoryGeneral);

/**
 * @swagger
 * /general/inventory/{id}:
 *   put:
 *     summary: Actualizar un registro del inventario general
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioGeneral'
 *     responses:
 *       200:
 *         description: Registro actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioGeneral'
 *       404:
 *         description: Registro no encontrado.
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.SOPORTE]), updateInventoryGeneral);

/**
 * @swagger
 * /general/inventory/statistics/warrantyExpiration:
 *   get:
 *     summary: Obtener estadísticas sobre la garantía del inventario general
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de garantía.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/statistics/warrantyExpiration/:id', authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE, ROLE_IDS.SOPORTE]), validarId, getInvetoryGeneralWarrantyStatitics);

/**
 * @swagger
 * /general/inventory/statistics/age:
 *   get:
 *     summary: Obtener estadísticas de edad del inventario general
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de edad.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/statistics/age/:id', authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE, ROLE_IDS.SOPORTE]),validarId, getInventoryGeneralAgeStatistics);

/**
 * @swagger
 * /general/inventory/statistics/headquarters:
 *   get:
 *     summary: Obtener estadísticas de cantidad por sede del inventario general
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de cantidad por sede.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sedeName:
 *                     type: string
 *                     description: Nombre de la sede
 *                   count:
 *                     type: integer
 *                     description: Cantidad de registros
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/statistics/headquarters/:id', authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE, ROLE_IDS.SOPORTE]), validarId, getInventoryGeneralByHeadquartersStatistics);

/**
 * @swagger
 * /general/inventory/search:
 *   get:
 *     summary: Buscar registros del inventario general por nombre, serial o responsable
 *     tags: [Inventario General]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           minLength: 2
 *         required: true
 *         description: Término de búsqueda (mínimo 2 caracteres)
 *         example: "Monitor"
 *     responses:
 *       200:
 *         description: Registros encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   item:
 *                     $ref: '#/components/schemas/InventarioGeneral'
 *                   departmentId:
 *                     type: integer
 *                     description: ID del departamento
 *                   departmentRelationName:
 *                     type: string
 *                     description: Nombre del departamento
 *                   sedeName:
 *                     type: string
 *                     description: Nombre de la sede
 *                   sedeId:
 *                     type: integer
 *                     description: ID de la sede
 *       400:
 *         description: La consulta debe tener al menos 2 caracteres.
 *       404:
 *         description: No se encontraron registros.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/search', authenticate, authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE, ROLE_IDS.SOPORTE]), searchInventoryGeneral);

export default router;