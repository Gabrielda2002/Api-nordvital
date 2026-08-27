import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";
import {
  getReportPqrsdf,
  previewReportPqrsdf,
} from "../controllers/report-pqrsdf.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/report/excel/pqrsdf/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de PQRSDF (mismos filtros que el Excel)
 *     tags: [Reportes Excel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del filtro (fecha de radicación)
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del filtro (fecha de radicación)
 *               status:
 *                 type: string
 *                 description: Filtro por estado (ABIERTO, EN_GESTION, CERRADO)
 *               classification:
 *                 type: string
 *                 description: Filtro por clasificación
 *               instance:
 *                 type: string
 *                 description: Filtro por instancia
 *               patientDocument:
 *                 type: string
 *                 description: Filtro por documento del paciente
 *               originAreaId:
 *                 type: integer
 *                 description: Filtro por ID de área de origen
 *     responses:
 *       200:
 *         description: Filas del reporte y total
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       401:
 *         description: No autorizado
 */
router.post(
  "/report/excel/pqrsdf/preview",
  authenticate,
  authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]),
  previewReportPqrsdf
);

/**
 * @swagger
 * /api/v1/report/excel/pqrsdf:
 *   post:
 *     summary: Descarga reporte de PQRSDF en Excel
 *     tags: [Reportes Excel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del filtro (fecha de radicación)
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del filtro (fecha de radicación)
 *               status:
 *                 type: string
 *                 description: Filtro por estado (ABIERTO, EN_GESTION, CERRADO)
 *               classification:
 *                 type: string
 *                 description: Filtro por clasificación
 *               instance:
 *                 type: string
 *                 description: Filtro por instancia
 *               patientDocument:
 *                 type: string
 *                 description: Filtro por documento del paciente
 *               originAreaId:
 *                 type: integer
 *                 description: Filtro por ID de área de origen
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No se encontraron PQRSDF en el rango especificado
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report/excel/pqrsdf",
  authenticate,
  authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]),
  getReportPqrsdf
);

export default router;