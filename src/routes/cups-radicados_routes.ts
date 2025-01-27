import { Router } from "express";
import { autorizarCups, createCupsRadicados, deleteCupsRadicados, getAllCupsRadicados, getCupsRadicados, updateAuditados, updateCupsRadicados } from "../controllers/cups-radicados_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();



/**
 * @swagger
 * /cups-radicados:
 *   get:
 *     summary: Obtiene todos los CUPS radicados
 *     tags: [CUPS Radicados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de CUPS radicados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/CupsRadicados'
 *                 
 *       401:
 *         description: No autorizado
 */
router.get("/cups-radicados", authenticate, authorizeRoles(['1', '2', '3', '5']), getAllCupsRadicados);

/**
 * @swagger
 * /cups-radicados/{id}:
 *   get:
 *     summary: Obtiene un CUPS radicado por ID
 *     tags: [CUPS Radicados]
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
 *         description: CUPS radicado encontrado
 *       404:
 *         description: CUPS radicado no encontrado
 */
router.get("/cups-radicados/:id", authenticate, authorizeRoles(['1', '2', '3', '5']), validarId, getCupsRadicados);

/**
 * @swagger
 * /cups-radicados:
 *   post:
 *     summary: Crea nuevos CUPS radicados
 *     tags: [CUPS Radicados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Códigos CUPS separados por comas
 *               DescriptionCode:
 *                 type: string
 *                 description: Descripciones separadas por comas
 *               idRadicado:
 *                 type: integer
 *     responses:
 *       201:
 *         description: CUPS radicados creados exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/cups-radicados", authenticate, authorizeRoles(['1','3','10','15', '6']), createCupsRadicados);

/**
 * @swagger
 * /cups-radicados/{id}:
 *   put:
 *     summary: Actualiza un CUPS radicado por ID
 *     tags: [CUPS Radicados]
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
 *               code:
 *                 type: integer
 *                 description: Código CUPS
 *               DescriptionCode:
 *                 type: string
 *                 description: Descripción del CUPS
 *               status:
 *                 type: integer
 *                 description: Estado del CUPS
 *               observation:
 *                 type: string
 *                 description: Observaciones
 *               functionalUnit:
 *                 type: integer
 *                 description: ID de la unidad funcional
 *               idRadicacion:
 *                 type: integer
 *                 description: ID de la radicación
 *     responses:
 *       200:
 *         description: CUPS radicado actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: CUPS radicado no encontrado
 */
router.put("/cups-radicados/:id", authenticate, authorizeRoles(['1', '2', '3' , '5']), validarId, updateCupsRadicados);

/**
 * @swagger
 * /cups-radicados/{id}:
 *   delete:
 *     summary: Elimina un CUPS radicado por ID
 *     tags: [CUPS Radicados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del CUPS radicado a eliminar
 *     responses:
 *       200:
 *         description: CUPS radicado eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cups Radicados deleted"
 *       404:
 *         description: CUPS radicado no encontrado
 */
router.delete("/cups-radicados/:id", authenticate, authorizeRoles(['1']), validarId, deleteCupsRadicados);

/**
 * @swagger
 * /autorizar-cups/{id}:
 *   put:
 *     summary: Autoriza CUPS radicados
 *     tags: [CUPS Radicados]
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
 *               cupsDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idCupsRadicado:
 *                       type: integer
 *                     estadoCups:
 *                       type: string
 *                     observacionCups:
 *                       type: string
 *                     unidadFuncional:
 *                       type: string
 *     responses:
 *       200:
 *         description: CUPS autorizados exitosamente
 *       404:
 *         description: CUPS no encontrados
 */
router.put("/autorizar-cups/:id", authenticate, authorizeRoles(['1', '2', '3']), validarId, autorizarCups);

/**
 * @swagger
 * /actualizar-cups/{id}:
 *   put:
 *     summary: Actualiza el estado y observación de un CUPS radicado
 *     tags: [CUPS Radicados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del CUPS radicado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 description: Nuevo estado del CUPS
 *               observation:
 *                 type: string
 *                 description: Nueva observación del CUPS
 *     responses:
 *       200:
 *         description: CUPS actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cups actualizado exitosamente!"
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: CUPS radicado no encontrado
 */
router.put("/actualizar-cups/:id", authenticate, authorizeRoles(['1', '2', '3']), validarId, updateAuditados);

export default router;