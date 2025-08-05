import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { creatAuditRequestLetter, createRecoveryLetter, createRequestLetter, deleteRecoveryLetter, generatePdf, getAllRecoveryLetter, getRecoveryLetterById, getRequestLetter, getResponseLetter, saveDateImpress, updateRecoveryLetter } from "../controllers/carta-recobro.controller";
import { getDepartmentUser } from "../middlewares/get-department-user_middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartaRecobro:
 *       type: object
 *       required:
 *         - id_radicado
 *         - id_usuario_solicita
 *         - justificacion
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado de la carta de recobro
 *         id_radicado:
 *           type: integer
 *           description: ID del radicado asociado
 *         id_usuario_solicita:
 *           type: integer
 *           description: ID del usuario que solicita
 *         id_usuario_audita:
 *           type: integer
 *           description: ID del usuario que audita
 *         observacion:
 *           type: string
 *           description: Observaciones de la carta
 *         justificacion:
 *           type: string
 *           description: Justificación de la carta
 *         fecha_impresion:
 *           type: string
 *           format: date
 *           description: Fecha de impresión
 */

/**
 * @swagger
 * /recover-letter:
 *   get:
 *     summary: Obtiene todas las cartas de recobro
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cartas de recobro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartaRecobro'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /recover-letter/{id}:
 *   get:
 *     summary: Obtiene una carta de recobro por ID
 *     tags: [Cartas de Recobro]
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
 *         description: Carta de recobro encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartaRecobro'
 */

/**
 * @swagger
 * /recover-letter:
 *   post:
 *     summary: Crea una nueva carta de recobro
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartaRecobro'
 *     responses:
 *       201:
 *         description: Carta de recobro creada exitosamente
 */

/**
 * @swagger
 * /recover-letter/{id}:
 *   put:
 *     summary: Actualiza una carta de recobro
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartaRecobro'
 *     responses:
 *       200:
 *         description: Carta de recobro actualizada exitosamente
 */

/**
 * @swagger
 * /recover-letter/{id}:
 *   delete:
 *     summary: Elimina una carta de recobro
 *     tags: [Cartas de Recobro]
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
 *         description: Carta de recobro eliminada exitosamente
 */

/**
 * @swagger
 * /table-request-letter/{documentPatient}:
 *   get:
 *     summary: Obtiene solicitudes de carta por documento del paciente
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentPatient
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitudes encontradas
 */

/**
 * @swagger
 * /table-response-letter:
 *   get:
 *     summary: Obtiene respuestas de cartas
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respuestas encontradas
 */

/**
 * @swagger
 * /create-request-letter:
 *   post:
 *     summary: Crea una nueva solicitud de carta
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartaRecobro'
 *     responses:
 *       201:
 *         description: Solicitud de carta creada exitosamente
 */

/**
 * @swagger
 * /create-audit-letter/{id}:
 *   put:
 *     summary: Crea una auditoría para una carta de recobro
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartaRecobro'
 *     responses:
 *       200:
 *         description: Auditoría creada exitosamente
 */

/**
 * @swagger
 * /generate-pdf/{idRadicado}:
 *   get:
 *     summary: Genera PDF de la carta de recobro
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idRadicado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /save-date-print/{id}:
 *   put:
 *     summary: Guarda la fecha de impresión de la carta de recobro
 *     tags: [Cartas de Recobro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_impresion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de impresión
 *     responses:
 *       200:
 *         description: Fecha de impresión guardada exitosamente
 */

router.get("/recover-letter", authenticate, authorizeRoles(["1"]), getAllRecoveryLetter)

router.get("/recover-letter/:id", authenticate, authorizeRoles(["1"]), getRecoveryLetterById)

router.post("/recover-letter", authenticate, authorizeRoles(["1"]), createRecoveryLetter)

router.put("/recover-letter/:id", authenticate, authorizeRoles(["1"]), updateRecoveryLetter)

router.delete("/recover-letter/:id", authenticate, authorizeRoles(["1"]), deleteRecoveryLetter)

router.get("/table-request-letter/:documentPatient", authenticate, authorizeRoles(["1"]), getDepartmentUser, getRequestLetter)

router.get("/table-response-letter", authenticate, authorizeRoles(["1"]),getDepartmentUser , getResponseLetter)

router.post("/create-request-letter", authenticate, authorizeRoles(["1"]), createRequestLetter)

router.put("/create-audit-letter/:id", authenticate, authorizeRoles(["1"]), creatAuditRequestLetter)

router.get("/generate-pdf/:idRadicado", authenticate, authorizeRoles(["1"]), generatePdf)

router.put('/save-date-print/:id', authenticate, authorizeRoles(["1"]), saveDateImpress);

export default router;