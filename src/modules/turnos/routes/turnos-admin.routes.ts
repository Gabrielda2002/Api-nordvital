import { Router } from "express";
import { TurnosAdminController } from "../controllers/turnos-admin.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

// Rutas administrativas protegidas por autenticación y roles de Gestión / Calidad
router.use(authenticate);
router.use(authorizeRoles([...ROLE_GROUPS.MANAGEMENT]));

/**
 * @swagger
 * /turnos/admin/sedes-config:
 *   get:
 *     summary: Obtener configuraciones de todas las sedes para el módulo de turnos
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de configuraciones de sedes
 */
router.get("/sedes-config", TurnosAdminController.getSedesConfig);

/**
 * @swagger
 * /turnos/admin/sedes-config:
 *   post:
 *     summary: Guardar o actualizar configuración de una sede (slug, lat/lng, radio)
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [headquarterId, slug, latitude, longitude]
 *     responses:
 *       201:
 *         description: Configuración guardada con éxito
 */
router.post("/sedes-config", TurnosAdminController.saveSedeConfig);

/**
 * @swagger
 * /turnos/admin/sedes/{headquarterId}/servicios:
 *   get:
 *     summary: Consultar catálogo activo y servicios asignados a una sede
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: headquarterId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Catálogo activo con indicador de asignación y todos los IDs actualmente asignados
 *       404:
 *         description: Sede no encontrada
 */
router.get("/sedes/:headquarterId/servicios", TurnosAdminController.getServiciosSede);

/**
 * @swagger
 * /turnos/admin/sedes/{headquarterId}/servicios:
 *   put:
 *     summary: Reemplazar los servicios asignados a una sede
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: headquarterId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceIds]
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Asignaciones guardadas
 *       400:
 *         description: Servicios inválidos, duplicados o inactivos
 *       409:
 *         description: Un servicio retirado tiene sesiones activas o turnos sin resolver
 */
router.put("/sedes/:headquarterId/servicios", TurnosAdminController.saveServiciosSede);

/**
 * @swagger
 * /turnos/admin/modulos:
 *   get:
 *     summary: Obtener módulos físicos de atención
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: headquarterId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de módulos de atención de la sede
 */
router.get("/modulos", TurnosAdminController.getModulos);

/**
 * @swagger
 * /turnos/admin/modulos:
 *   post:
 *     summary: Crear un nuevo módulo físico de atención
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [headquarterId, code, name]
 *             properties:
 *               headquarterId:
 *                 type: integer
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Módulo creado con éxito
 */
router.post("/modulos", TurnosAdminController.createModulo);

/**
 * @swagger
 * /turnos/admin/modulos/{id}:
 *   put:
 *     summary: Actualizar un módulo físico de atención
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Módulo actualizado
 *       409:
 *         description: El módulo tiene una sesión activa
 */
router.put("/modulos/:id", TurnosAdminController.updateModulo);

/**
 * @swagger
 * /turnos/admin/kpis:
 *   get:
 *     summary: Obtener indicadores clave de rendimiento (KPIs) y métricas de turnos
 *     tags: [Turnos - Administración]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: headquarterId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Métricas operativas, tiempos promedio de espera y NPS
 */
router.get("/kpis", TurnosAdminController.getKpis);

export default router;
