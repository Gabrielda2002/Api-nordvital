import { Router } from "express";
import { createSurvey, deleteSurvey, getAllSurveys, getSurvey, updateSurvey } from "../controllers/encuesta-satisfaccion.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /surveys/satisfaction:
 *   get:
 *     summary: Obtiene todas las encuestas de satisfacción de pacientes
 *     tags: [EncuestasSatisfaccionPacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filtro por fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filtro por fecha de fin (YYYY-MM-DD)
 *       - in: query
 *         name: municipalityId
 *         schema:
 *           type: integer
 *         description: Filtro por ID de municipio
 *       - in: query
 *         name: patientDocument
 *         schema:
 *           type: string
 *         description: Filtro por documento del paciente
 *     responses:
 *       200:
 *         description: Lista de encuestas de satisfacción
 */
router.get("/surveys/satisfaction", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), getAllSurveys);

/**
 * @swagger
 * /surveys/satisfaction/{id}:
 *   get:
 *     summary: Obtiene una encuesta de satisfacción por ID
 *     tags: [EncuestasSatisfaccionPacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *       404:
 *         description: Encuesta no encontrada
 */
router.get("/surveys/satisfaction/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, getSurvey);

/**
 * @swagger
 * /surveys/satisfaction:
 *   post:
 *     summary: Crea una nueva encuesta de satisfacción de paciente
 *     tags: [EncuestasSatisfaccionPacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EncuestaSatisfaccion'
 *     responses:
 *       201:
 *         description: Encuesta creada
 *       400:
 *         description: Error de validación
 */
router.post("/surveys/satisfaction", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), createSurvey);

/**
 * @swagger
 * /surveys/satisfaction/{id}:
 *   put:
 *     summary: Actualiza una encuesta de satisfacción
 *     tags: [EncuestasSatisfaccionPacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EncuestaSatisfaccion'
 *     responses:
 *       200:
 *         description: Encuesta actualizada
 *       404:
 *         description: Encuesta no encontrada
 */
router.put("/surveys/satisfaction/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, updateSurvey);

/**
 * @swagger
 * /surveys/satisfaction/{id}:
 *   delete:
 *     summary: Elimina una encuesta de satisfacción
 *     tags: [EncuestasSatisfaccionPacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Encuesta eliminada
 *       404:
 *         description: Encuesta no encontrada
 */
router.delete("/surveys/satisfaction/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, deleteSurvey);

export default router;
