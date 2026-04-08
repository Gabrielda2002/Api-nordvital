import { Router } from "express";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import {
  getChecklistItems,
  getChecklistByFollowUp,
  saveChecklist,
  toggleChecklistItem,
} from "../controllers/maintenance-checklist.controller";

const router = Router();

/**
 * @swagger
 * /maintenance-checklist/items:
 *   get:
 *     summary: Obtiene todos los ítems activos del checklist maestro
 *     tags: [Maintenance Checklist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ítems del checklist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   itemKey:
 *                     type: string
 *                   label:
 *                     type: string
 *                   displayOrder:
 *                     type: integer
 *                   isActive:
 *                     type: boolean
 */
router.get(
  "/maintenance-checklist/items",
  authenticate,
  authorizeRoles(["1"]),
  getChecklistItems
);

/**
 * @swagger
 * /maintenance-checklist/seguimiento/{seguimientoId}:
 *   get:
 *     summary: Obtiene el checklist completo de un seguimiento de equipo
 *     tags: [Maintenance Checklist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seguimientoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del seguimiento de equipo
 *     responses:
 *       200:
 *         description: Checklist del seguimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   seguimientoEquipoId:
 *                     type: integer
 *                   checklistItemId:
 *                     type: integer
 *                   isChecked:
 *                     type: boolean
 *                   checkedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   checklistItemRelation:
 *                     type: object
 *       404:
 *         description: Seguimiento no encontrado
 */
router.get(
  "/maintenance-checklist/seguimiento/:id",
  authenticate,
  authorizeRoles(["1"]),
  validarId,
  getChecklistByFollowUp
);

/**
 * @swagger
 * /maintenance-checklist/seguimiento/{seguimientoId}:
 *   put:
 *     summary: Guarda/actualiza el checklist de un seguimiento
 *     tags: [Maintenance Checklist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seguimientoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del seguimiento de equipo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - checklistItemId
 *                     - isChecked
 *                   properties:
 *                     checklistItemId:
 *                       type: integer
 *                     isChecked:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Checklist guardado exitosamente
 *       400:
 *         description: Datos inválidos o tipo de seguimiento incorrecto
 *       404:
 *         description: Seguimiento no encontrado
 */
router.put(
  "/maintenance-checklist/seguimiento/:id",
  authenticate,
  authorizeRoles(["1"]),
  validarId,
  saveChecklist
);

/**
 * @swagger
 * /maintenance-checklist/result/{resultId}/toggle:
 *   patch:
 *     summary: Alterna el estado de un ítem del checklist
 *     tags: [Maintenance Checklist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del resultado del checklist
 *     responses:
 *       200:
 *         description: Estado del ítem actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 seguimientoEquipoId:
 *                   type: integer
 *                 checklistItemId:
 *                   type: integer
 *                 isChecked:
 *                   type: boolean
 *                 checkedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       404:
 *         description: Ítem del checklist no encontrado
 */
router.patch(
  "/maintenance-checklist/result/:resultId/toggle",
  authenticate,
  authorizeRoles(["1"]),
  validarId,
  toggleChecklistItem
);

export default router;
