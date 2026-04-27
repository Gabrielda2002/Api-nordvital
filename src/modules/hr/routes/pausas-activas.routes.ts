import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createActiveBrake, deleteActiveBrake, getActiveBrakeById, getAllActiveBrakes, updateActiveBrake } from "../controllers/pausas-activas.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /active-brakes:
 *   get:
 *     summary: Obtiene todas las pausas activas
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pausas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PausasActivas'
 *       401:
 *         description: No autorizado
 */
router.get("/active-brakes", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllActiveBrakes)

/**
 * @swagger
 * /active-brakes/{id}:
 *   get:
 *     summary: Obtiene una pausa activa por ID
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pausa activa
 *     responses:
 *       200:
 *         description: Pausa activa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PausasActivas'
 *       404:
 *         description: Pausa activa no encontrada
 */
router.get("/active-brakes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getActiveBrakeById)

/**
 * @swagger
 * /active-brakes:
 *   post:
 *     summary: Crea una nueva pausa activa
 *     tags: [Pausas Activas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observation
 *               - userId
 *             properties:
 *               observation:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pausa activa creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PausasActivas'
 *       400:
 *         description: Error en la validación
 */
router.post("/active-brakes", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.CALIDAD, ROLE_IDS.AUXILIAR, ROLE_IDS.COORDINADOR, ROLE_IDS.RADICADOR, ROLE_IDS.SIAU, ROLE_IDS.CONTRATACION, ROLE_IDS.MEDICO, ROLE_IDS.JEFE, ROLE_IDS.CIRUGIA, ROLE_IDS.PARAMEDICO, ROLE_IDS.SOPORTE, ROLE_IDS.RRHH, ROLE_IDS.ENFERMERIA, ROLE_IDS.COORDINADORA_ENFERMERIA, ROLE_IDS.LIDER_ENFERMERIA]), createActiveBrake)

/**
 * @swagger
 * /active-brakes/{id}:
 *   put:
 *     summary: Actualiza una pausa activa
 *     tags: [Pausas Activas]
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
 *             required:
 *               - observation
 *               - userId
 *             properties:
 *               observation:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pausa activa actualizada
 *       404:
 *         description: Pausa activa no encontrada
 */
router.put("/active-brakes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, updateActiveBrake)

/**
 * @swagger
 * /active-brakes/{id}:
 *   delete:
 *     summary: Elimina una pausa activa
 *     tags: [Pausas Activas]
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
 *         description: Pausa activa eliminada
 *       404:
 *         description: Pausa activa no encontrada
 */
router.delete("/active-brakes/:id", authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deleteActiveBrake)

export default router;