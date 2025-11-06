import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createInventoryGeneral, getAllInventarioGeneral, getAllInventoryGeneralByHeadquarters, getInventoryGeneralAgeStatistics, getInventoryGeneralByHeadquartersStatistics, getInvetoryGeneralWarrantyStatitics, searchInventoryGeneral, updateInventoryGeneral } from "../controllers/inventario-general.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";

const router = Router();

/**
 * @swagger
 * /inventario/general:
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
router.get('/inventario/general', authenticate, authorizeRoles(['1']), getAllInventarioGeneral);

/**
 * @swagger
 * /inventario/general-sede/{id}:
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
router.get('/inventario/general-sede/:id', authenticate, authorizeRoles(['1', '6', '4']), getAllInventoryGeneralByHeadquarters);

/**
 * @swagger
 * /inventario/general:
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
router.post('/inventario/general', authenticate, authorizeRoles(['1','6']), createInventoryGeneral);

/**
 * @swagger
 * /inventario/general/{id}:
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
router.put('/inventario/general/:id', authenticate, authorizeRoles(['1', '6']), updateInventoryGeneral);

/**
 * @swagger
 * /inventario/general/statistics/warrantyExpiration:
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
router.get('/inventario/general/statistics/warrantyExpiration/:id', authenticate, authorizeRoles(['1', '6']), validarId, getInvetoryGeneralWarrantyStatitics);

/**
 * @swagger
 * /inventario/general/statistics/age:
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
router.get('/inventario/general/statistics/age/:id', authenticate, authorizeRoles(['1', '6']),validarId, getInventoryGeneralAgeStatistics);

/**
 * @swagger
 * /inventario/general/statistics/headquarters:
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
router.get('/inventario/general/statistics/headquarters/:id', authenticate, authorizeRoles(['1', '6']), validarId, getInventoryGeneralByHeadquartersStatistics);

/**
 * @swagger
 * /search/inventario/general:
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
router.get('/search/inventario/general', authenticate, authorizeRoles(['1', '6']), searchInventoryGeneral);

export default router;