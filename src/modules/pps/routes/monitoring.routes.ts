import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { upsertMonitoring } from "../controllers/monitoring.controller";

const router = Router();

/**
 * @swagger
 * /pps/programmed-activities/{id}/monitoring:
 *   put:
 *     summary: Registra o actualiza el seguimiento de una actividad programada (guarda parcial por campo)
 *     description: Se puede enviar solo el campo que cambió. Los campos enviados como null o cadena vacía se limpian. La completitud del seguimiento (resultado, población intervenida, total de personas, recursos ejecutados, fuente, link y medio de verificación) se refleja en monitoringComplete del listado.
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad programada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsMonitoringRequest'
 *     responses:
 *       200:
 *         description: Seguimiento guardado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsMonitoring'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Actividad programada no encontrada
 */
router.put("/programmed-activities/:id/monitoring", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, upsertMonitoring);

export default router
