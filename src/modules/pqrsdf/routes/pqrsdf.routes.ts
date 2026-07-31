import { Router } from "express";
import {
    createPqrsdf,
    deletePqrsdf,
    getAllPqrsdf,
    getPqrsdf,
    updatePqrsdf,
} from "../controllers/pqrsdf.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /pqrsdf:
 *   get:
 *     summary: Obtiene todas las PQRSDF
 *     tags: [PQRSDF]
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtro por estado (ABIERTO, EN_GESTION, CERRADO)
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *         description: Filtro por clasificación
 *       - in: query
 *         name: instance
 *         schema:
 *           type: string
 *         description: Filtro por instancia
 *       - in: query
 *         name: patientDocument
 *         schema:
 *           type: string
 *         description: Filtro por documento del paciente
 *       - in: query
 *         name: originAreaId
 *         schema:
 *           type: integer
 *         description: Filtro por ID de área de origen
 *     responses:
 *       200:
 *         description: Lista de PQRSDF
 */
router.get("/pqrsdf", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), getAllPqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}:
 *   get:
 *     summary: Obtiene una PQRSDF por ID
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la PQRSDF
 *     responses:
 *       200:
 *         description: PQRSDF encontrada
 *       404:
 *         description: PQRSDF no encontrada
 */
router.get("/pqrsdf/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, getPqrsdf);

/**
 * @swagger
 * /pqrsdf:
 *   post:
 *     summary: Crea una nueva PQRSDF
 *     tags: [PQRSDF]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pqrsdf'
 *     responses:
 *       201:
 *         description: PQRSDF creada
 *       400:
 *         description: Error de validación
 */
router.post("/pqrsdf", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), createPqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}:
 *   put:
 *     summary: Actualiza una PQRSDF
 *     tags: [PQRSDF]
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
 *             $ref: '#/components/schemas/Pqrsdf'
 *     responses:
 *       200:
 *         description: PQRSDF actualizada
 *       404:
 *         description: PQRSDF no encontrada
 */
router.put("/pqrsdf/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, updatePqrsdf);

/**
 * @swagger
 * /pqrsdf/{id}:
 *   delete:
 *     summary: Elimina una PQRSDF
 *     tags: [PQRSDF]
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
 *         description: PQRSDF eliminada
 *       404:
 *         description: PQRSDF no encontrada
 */
router.delete("/pqrsdf/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.SIAU, ROLE_IDS.CALIDAD]), validarId, deletePqrsdf);

export default router;
