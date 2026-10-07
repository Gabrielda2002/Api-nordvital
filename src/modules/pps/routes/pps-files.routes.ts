import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { downloadProgrammingFile, downloadMonitoringFile } from "../controllers/pps-files.controller";

const router = Router();

/**
 * @swagger
 * /pps/periods/{id}/programmed-activities/file:
 *   get:
 *     summary: Descarga el archivo plano de programación (.txt)
 *     description: 'Formato: fila de control 1|tipoId|identificación|fechaInicio|fechaFin|N°registros y filas de detalle 2|consec|territorio|línea|meta|descMeta|actividad|descAct|expresión|población|fechaInicio|fechaFin|recursos. Separador |, UTF-8, saltos CRLF. El nombre es prefijo + AAAAMMDD (fecha fin de vigencia) + tipo id + identificación a 12 dígitos.'
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - text/plain
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la vigencia
 *     responses:
 *       200:
 *         description: Archivo plano de programación
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Entidad sin configurar, vigencia sin actividades o actividades con datos inválidos
 *       404:
 *         description: Vigencia no encontrada
 */
router.get("/periods/:id/programmed-activities/file", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, downloadProgrammingFile);

/**
 * @swagger
 * /pps/periods/{id}/monitoring/file:
 *   get:
 *     summary: Descarga el archivo plano de seguimiento (.txt)
 *     description: 'Formato: fila de control 1|tipoId|identificación|fechaInicio|fechaFin|N°registros y filas de detalle 2|consec|territorio|línea|meta|actividad|resultado|poblaciónIntervenida|totalPersonas|recursosEjecutados|fuente|link|medioVerificación. El nombre usa la fecha de corte de la vigencia.'
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - text/plain
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la vigencia
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         description: Si es true, genera el archivo aunque haya actividades con seguimiento incompleto (los campos faltantes salen vacíos)
 *     responses:
 *       200:
 *         description: Archivo plano de seguimiento
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Entidad sin configurar, vigencia sin actividades o seguimiento incompleto (sin force)
 *       404:
 *         description: Vigencia no encontrada
 */
router.get("/periods/:id/monitoring/file", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, downloadMonitoringFile);

export default router;
