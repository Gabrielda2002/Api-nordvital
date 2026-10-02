import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_GROUPS } from "@core/constants/roles";
import { getActionLines, createActionLine, updateActionLine, disableActionLine } from "../controllers/action-lines.controller";

const router = Router();

/**
 * @swagger
 * /pps/action-lines:
 *   get:
 *     summary: Lista las líneas de acción (catálogo PPS)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: onlyActive
 *         schema:
 *           type: boolean
 *         description: Si es true, solo devuelve registros activos
 *     responses:
 *       200:
 *         description: Lista de líneas de acción
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PpsActionLine'
 */
router.get("/action-lines", authenticate, authorizeRoles(ROLE_GROUPS.PPS), getActionLines);

/**
 * @swagger
 * /pps/action-lines:
 *   post:
 *     summary: Crea una línea de acción (el eje estratégico se deriva del código)
 *     tags: [PPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PpsCatalogRequest'
 *     responses:
 *       201:
 *         description: Línea de acción creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsActionLine'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe una línea de acción con ese código
 */
router.post("/action-lines", authenticate, authorizeRoles(ROLE_GROUPS.PPS), createActionLine);

/**
 * @swagger
 * /pps/action-lines/{id}:
 *   put:
 *     summary: Actualiza una línea de acción
 *     tags: [PPS]
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
 *             $ref: '#/components/schemas/PpsCatalogRequest'
 *     responses:
 *       200:
 *         description: Línea de acción actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PpsActionLine'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Línea de acción no encontrada
 *       409:
 *         description: Ya existe una línea de acción con ese código
 */
router.put("/action-lines/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, updateActionLine);

/**
 * @swagger
 * /pps/action-lines/{id}:
 *   delete:
 *     summary: Desactiva una línea de acción (no se elimina físicamente)
 *     tags: [PPS]
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
 *         description: Línea de acción desactivada
 *       404:
 *         description: Línea de acción no encontrada
 */
router.delete("/action-lines/:id", authenticate, authorizeRoles(ROLE_GROUPS.PPS), validarId, disableActionLine);

export default router;
