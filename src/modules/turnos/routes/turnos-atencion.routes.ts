import { Router } from "express";
import { TurnosAtencionController } from "../controllers/turnos-atencion.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

// La operación de turnos está disponible para Administrador y Radicador.
router.use(authenticate);
router.use(authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.RADICADOR]));

/**
 * @swagger
 * /turnos/atencion/opciones:
 *   get:
 *     summary: Obtener módulos y servicios activos para iniciar una sesión
 *     tags: [Turnos - Atención Asesor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Opciones operativas de módulos y servicios activos
 */
router.get("/opciones", TurnosAtencionController.getOpcionesSesion);

/**
 * @swagger
 * /turnos/atencion/sesion/iniciar:
 *   post:
 *     summary: Iniciar sesión de atención de un asesor en un módulo físico
 *     tags: [Turnos - Atención Asesor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [moduloId, serviceIds]
 *             properties:
 *               moduloId:
 *                 type: integer
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Sesión iniciada con éxito
 *       409:
 *         description: Módulo ocupado por otro asesor
 */
router.post("/sesion/iniciar", TurnosAtencionController.iniciarSesion);

/**
 * @swagger
 * /turnos/atencion/sesion/cerrar:
 *   post:
 *     summary: Cerrar sesión activa del asesor y liberar el módulo
 *     tags: [Turnos - Atención Asesor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada con éxito
 *       409:
 *         description: No se puede cerrar sesión con un turno llamado o en atención
 */
router.post("/sesion/cerrar", TurnosAtencionController.cerrarSesion);

/**
 * @swagger
 * /turnos/atencion/estado-actual:
 *   get:
 *     summary: Obtener estado de la sesión activa del asesor y su turno en curso
 *     tags: [Turnos - Atención Asesor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información de sesión, turno activo y cola pendiente
 */
router.get("/estado-actual", TurnosAtencionController.getEstadoActual);

/**
 * @swagger
 * /turnos/atencion/accion:
 *   post:
 *     summary: Ejecutar acción de la máquina de estados sobre los turnos (LLAMAR, RELLAMAR, INICIAR, FINALIZAR, NO_ASISTIO, TRANSFERIR)
 *     tags: [Turnos - Atención Asesor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [LLAMAR, RELLAMAR, INICIAR, FINALIZAR, NO_ASISTIO, TRANSFERIR, CANCELAR]
 *               turnoId:
 *                 type: integer
 *               newServiceId:
 *                 type: integer
 *               notes:
 *                 type: string
 *                 description: Obligatorio para CANCELAR; motivo de cancelación.
 *     responses:
 *       200:
 *         description: Acción procesada con éxito
 *       409:
 *         description: Conflicto de estado de turno
 */
router.post("/accion", TurnosAtencionController.ejecutarAccion);

export default router;
