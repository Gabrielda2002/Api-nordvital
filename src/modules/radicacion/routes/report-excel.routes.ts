import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
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
  previewReportAssistants,
  previewReportBiometric,
  previewReportBreakesActive,
  previewReportDemandInduced,
  previewReportEquipments,
  previewReportGeneralInventory,
  previewReportPhones,
  previewReportRedDevice,
  previewReportServices,
  previewReportSurgerys,
  previewReportTickets,
  previewReportTV,
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
/**
 * @swagger
 * /api/v1/report/excel/radicacion/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de radicaciones (mismos filtros que el Excel)
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
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report/excel/radicacion/preview",
  authenticate,
  authorizeRoles(ROLE_GROUPS.REPORT_MANAGERS),
  previewReportServices
);

router.post(
  "/report/excel/radicacion",
  authenticate,
  authorizeRoles(ROLE_GROUPS.REPORT_MANAGERS),
  getReportServices
);

/**
 * @swagger
 * /api/v1/report/excel/surgeries:
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
/**
 * @swagger
 * /api/v1/report/excel/surgeries/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de cirugías (mismos filtros que el Excel)
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
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/report/excel/surgeries/preview",
  authenticate,
  authorizeRoles(ROLE_GROUPS.REPORT_MANAGERS),
  previewReportSurgerys
);

router.post(
  "/report/excel/surgeries",
  authenticate,
  authorizeRoles(ROLE_GROUPS.REPORT_MANAGERS),
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
/**
 * @swagger
 * /api/v1/report/excel/assistants/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de gestión auxiliar
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
  "/report/excel/assistants/preview",
  authenticate,
  authorizeRoles(ROLE_GROUPS.REPORT_MANAGERS),
  previewReportAssistants
);

router.post(
  "/report/excel/assistants",
  authenticate,
  authorizeRoles(ROLE_GROUPS.REPORT_MANAGERS),
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
/**
 * @swagger
 * /api/v1/report/excel/breakes/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de pausas activas
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
  "/report/excel/breakes/preview",
  authenticate,
  authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE]),
);

router.post(
  "/report/excel/breakes",
  authenticate,
  authorizeRoles([...ROLE_GROUPS.COORDINADORES, ROLE_IDS.GERENTE]),
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
/**
 * @swagger
 * /api/v1/report/excel/biometric/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de registros biométricos
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
  "/report/excel/biometric/preview",
  authenticate,
  authorizeRoles(ROLE_GROUPS.APPROVAL_MANAGERS_FULL),
  previewReportBiometric
);

router.post(
  "/report/excel/biometric",
  authenticate,
  authorizeRoles(ROLE_GROUPS.APPROVAL_MANAGERS_FULL),
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
/**
 * @swagger
 * /api/v1/report/excel/tickets/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de tickets de mesa de ayuda
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
  "/report/excel/tickets/preview",
  authenticate,
  authorizeRoles([ROLE_IDS.ADMINISTRADOR]),
  previewReportTickets
);

router.post(
  "/report/excel/tickets"
  , authenticate
  , authorizeRoles([ROLE_IDS.ADMINISTRADOR])
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
/**
 * @swagger
 * /api/v1/report/excel/demand-induced/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de demanda inducida
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
 *               dateEnd:
 *                 type: string
 *                 format: date
 *               headquarter:
 *                 type: string
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
  "/report/excel/demand-induced/preview",
  authenticate,
  authorizeRoles(ROLE_GROUPS.ADMIN_NURSING),
  previewReportDemandInduced
);

router.post(
  "/report/excel/demand-induced"
  , authenticate
  , authorizeRoles(ROLE_GROUPS.ADMIN_NURSING)
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
/**
 * @swagger
 * /api/v1/report/excel/equipments/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de inventario de equipos
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
router.post("/report/excel/equipments/preview", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), previewReportEquipments);

router.post("/report/excel/equipments", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getReportEquipments);

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
/**
 * @swagger
 * /api/v1/report/excel/device-red/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de dispositivos de red
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
router.post("/report/excel/device-red/preview", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), previewReportRedDevice);

router.post("/report/excel/device-red", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getReportRedDevice);

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
/**
 * @swagger
 * /api/v1/report/excel/general-inventory/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de inventario general
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
router.post("/report/excel/general-inventory/preview", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), previewReportGeneralInventory);

router.post("/report/excel/general-inventory", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getReportGeneralInventory);

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
/**
 * @swagger
 * /api/v1/report/excel/tv/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de televisores
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
router.post("/report/excel/tv/preview", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), previewReportTV);

router.post("/report/excel/tv", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getReportTV);

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
/**
 * @swagger
 * /api/v1/report/excel/phones/preview:
 *   post:
 *     summary: Vista previa JSON del reporte de teléfonos
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
 *               dateEnd:
 *                 type: string
 *                 format: date
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
router.post("/report/excel/phones/preview", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), previewReportPhones);

router.post("/report/excel/phones", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getReportPhones);

export default router;
