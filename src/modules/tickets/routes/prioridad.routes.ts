import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createPriority, deletePriority, getAllPriority, getPriorityById, updatePriority } from "../controllers/prioridad.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

/**
 * @swagger
 * /prioridades:
 *   get:
 *     summary: Obtener todas las prioridades
 *     tags: [Prioridades]
 *     responses:
 *       200:
 *         description: Lista de todas las prioridades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prioridad'
 */
router.get('/prioridades', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.CALIDAD, ROLE_IDS.AUXILIAR, ROLE_IDS.COORDINADOR, ROLE_IDS.RADICADOR, ROLE_IDS.SIAU, ROLE_IDS.CONTRATACION, ROLE_IDS.MEDICO, ROLE_IDS.JEFE, ROLE_IDS.CIRUGIA, ROLE_IDS.PARAMEDICO, ROLE_IDS.SOPORTE, ROLE_IDS.RRHH, ROLE_IDS.ENFERMERIA, ROLE_IDS.COORDINADORA_ENFERMERIA, ROLE_IDS.LIDER_ENFERMERIA]), getAllPriority);

/**
 * @swagger
 * /prioridades/{id}:
 *   get:
 *     summary: Obtener una prioridad por ID
 *     tags: [Prioridades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     responses:
 *       200:
 *         description: Prioridad obtenida por ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prioridad'
 *       404:
 *         description: Prioridad no encontrada
 */
router.get('/prioridades/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, getPriorityById);

/**
 * @swagger
 * /prioridades:
 *   post:
 *     summary: Crear una nueva prioridad
 *     tags: [Prioridades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prioridad'
 *     responses:
 *       200:
 *         description: Prioridad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prioridad'
 *       400:
 *         description: Error en la solicitud
 */
router.post('/prioridades', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), createPriority);

/**
 * @swagger
 * /prioridades/{id}:
 *   put:
 *     summary: Actualizar una prioridad por ID
 *     tags: [Prioridades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prioridad'
 *     responses:
 *       200:
 *         description: Prioridad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prioridad'
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Prioridad no encontrada
 */
router.put('/prioridades/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), updatePriority);

/**
 * @swagger
 * /prioridades/{id}:
 *   delete:
 *     summary: Eliminar una prioridad por ID
 *     tags: [Prioridades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     responses:
 *       200:
 *         description: Prioridad eliminada exitosamente
 *       404:
 *         description: Prioridad no encontrada
 */
router.delete('/prioridades/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId, deletePriority);

export default router;
