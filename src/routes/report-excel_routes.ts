import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import {
  downloadReportExcel,
  downloadReportExcelFilter,
  getReportBiometric,
  getReportBreakesActive,
  getReportTickets,
  reportDemandInduced,
  reporteGestionAuxiliar,
  reportExcelCirugias,
  reportExcelCirugiasFiltros,
  reportExcelRadicacion,
  reportInventoryEquipments,
} from "../controllers/report-excel.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/report-excel:
 *   get:
 *     summary: Descarga reporte general de radicaciones en Excel
 *     tags: [Reportes Excel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/report-excel",
  authenticate,
  authorizeRoles(["1", "3", "6", "2", "14", "3", "15"]),
  downloadReportExcel
);

/**
 * @swagger
 * /api/v1/report-excel-filtro:
 *   post:
 *     summary: Descarga reporte de radicaciones filtrado en Excel
 *     tags: [Reportes Excel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportExcelFilter'
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report-excel-filtro",
  authenticate,
  authorizeRoles(["1", "3", "6", "14", "3", "15"]),
  reportExcelRadicacion
);

/**
 * @swagger
 * /api/v1/report-excel-cirugias:
 *   get:
 *     summary: Descarga reporte general de cirugías en Excel
 *     tags: [Reportes Excel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/report-excel-cirugias",
  authenticate,
  authorizeRoles(["1", "3", "6", "2", "14", "3", "15"]),
  reportExcelCirugias
);

/**
 * @swagger
 * /api/v1/report-excel-cirugias-filtro:
 *   post:
 *     summary: Descarga reporte de cirugías filtrado en Excel
 *     tags: [Reportes Excel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CirugiasFiltro'
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Debe enviar la fecha de ordenamiento
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report-excel-cirugias-filtro",
  authenticate,
  authorizeRoles(["1", "3", "6", "14", "3", "15"]),
  reportExcelCirugiasFiltros
);

/**
 * @swagger
 * /api/v1/report-excel-gestion-auxiliar:
 *   post:
 *     summary: Descarga reporte de gestión auxiliar en Excel
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
 *               dateStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del filtro
 *               dateEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del filtro
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report-excel-gestion-auxiliar",
  authenticate,
  authorizeRoles(["1", "3", "6", "14", "3", "15"]),
  reporteGestionAuxiliar
);

/**
 * @swagger
 * /api/v1/report-breakes-active:
 *   post:
 *     summary: Descarga reporte de pausas activas en Excel
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
 *               dateStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del filtro
 *               dateEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del filtro
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report-breakes-active",
  authenticate,
  authorizeRoles(["1", "2", "6"]),
  getReportBreakesActive
);

/**
 * @swagger
 * /api/v1/report/excel/biometric:
 *   post:
 *     summary: Descarga reporte de registros biométricos en Excel
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
 *               dateStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del filtro
 *               dateEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del filtro
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report/excel/biometric",
  authenticate,
  authorizeRoles(["1", "2", "6", "18", "20"]),
  getReportBiometric
);

/**
 * @swagger
 * /api/v1/report/tickets:
 *   post:
 *     summary: Descarga reporte de tickets de mesa de ayuda en Excel
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
 *               dateStart:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del filtro
 *               dateEnd:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del filtro
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No se encontraron tickets en el rango de fechas especificado
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report/tickets"
  , authenticate
  , authorizeRoles(["1"])
  , getReportTickets
)

router.post(
  "/reporte/demanda/inducida"
  , authenticate
  , authorizeRoles(["1", "19", "20", "21"])
  , reportDemandInduced
)

router.post("/report/equipments", authenticate, authorizeRoles(["1", "19", "20", "21"]), reportInventoryEquipments);

export default router;
