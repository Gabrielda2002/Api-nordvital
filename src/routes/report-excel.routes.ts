import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import {
  getReportAssistants,
  getReportBiometric,
  getReportBreakesActive,
  getReportDemandInduced,
  getReportEquipments,
  getReportGeneralInventory,
  getReportPhones,
  getReportRedDevice,
  getReportServices,
  getReportSurgerys,
  getReportTickets,
  getReportTV,
} from "../controllers/report-excel.controller";

const router = Router();


/**
 * @swagger
 * /api/v1/report/excel/radicacion:
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
  "/report/excel/radicacion",
  authenticate,
  authorizeRoles(["1", "3", "6", "14", "15"]),
  getReportServices
);

/**
 * @swagger
 * /api/v1/report/excel/surgerys:
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
  "/report/excel/surgerys",
  authenticate,
  authorizeRoles(["1", "3", "6", "14", "15"]),
  getReportSurgerys
);

/**
 * @swagger
 * /api/v1/report/excel/assistants:
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
  "/report/excel/assistants",
  authenticate,
  authorizeRoles(["1", "3", "6", "14", "15"]),
  getReportAssistants
);

/**
 * @swagger
 * /api/v1/report/excel/breakes:
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
  "/report/excel/breakes",
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
 * /api/v1/report/excel/tickets:
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
  "/report/excel/tickets"
  , authenticate
  , authorizeRoles(["1"])
  , getReportTickets
)

/**
 * @swagger
 * /api/v1/report/excel/demand-induced:
 *   post:
 *     summary: Descarga reporte de demanda inducida en Excel
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
 *               headquarter:
 *                 type: string
 *                 description: Sede para filtrar los resultados
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
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report/excel/demand-induced"
  , authenticate
  , authorizeRoles(["1", "19", "20", "21"])
  , getReportDemandInduced
)

/**
 * @swagger
 * /api/v1/report/excel/equipments:
 *   post:
 *     summary: Descarga reporte de inventario de equipos en Excel
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post("/report/excel/equipments", authenticate, authorizeRoles(["1"]), getReportEquipments);

/**
 * @swagger
 * /api/v1/report/excel/device-red:
 *   post:
 *     summary: Descarga reporte de dispositivos de red en Excel
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post("/report/excel/device-red", authenticate, authorizeRoles(["1"]), getReportRedDevice);

/**
 * @swagger
 * /api/v1/report/excel/general-inventory:
 *   post:
 *     summary: Descarga reporte de inventario general en Excel
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post("/report/excel/general-inventory", authenticate, authorizeRoles(["1"]), getReportGeneralInventory);

/**
 * @swagger
 * /api/v1/report/excel/tv:
 *   post:
 *     summary: Descarga reporte de televisores en Excel
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post("/report/excel/tv", authenticate, authorizeRoles(["1"]), getReportTV);

/**
 * @swagger
 * /api/v1/report/excel/phones:
 *   post:
 *     summary: Descarga reporte de teléfonos en Excel
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       500:
 *         description: Error del servidor
 */
router.post("/report/excel/phones", authenticate, authorizeRoles(["1"]), getReportPhones);

export default router;
