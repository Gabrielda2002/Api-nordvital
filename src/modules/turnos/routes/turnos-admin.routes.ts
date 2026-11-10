import { Router } from "express";
import { TurnosAdminController } from "../controllers/turnos-admin.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_GROUPS, ROLE_IDS } from "@core/constants/roles";

const router = Router();

// Rutas administrativas protegidas por autenticación y roles de Gestión / Calidad
router.use(authenticate);
router.use(authorizeRoles([...ROLE_GROUPS.MANAGEMENT, ROLE_IDS.CALIDAD]));

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
 *         description: Lista de módulos
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Módulo actualizado
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

