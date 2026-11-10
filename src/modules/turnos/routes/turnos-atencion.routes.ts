import { Router } from "express";
import { TurnosAtencionController } from "../controllers/turnos-atencion.controller";
import { authenticate } from "@core/middlewares/authenticate.middleware";

const router = Router();

// Todas las rutas de atención requieren autenticación
router.use(authenticate);

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
 *         description: No se puede cerrar sesión con turnos en atención
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
 *         description: Información de sesión y turno activo
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
 *     responses:
 *       200:
 *         description: Acción procesada con éxito
 *       409:
 *         description: Conflicto de estado de turno
 */
router.post("/accion", TurnosAtencionController.ejecutarAccion);

export default router;

