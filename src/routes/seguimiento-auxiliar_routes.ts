import { Router } from "express";
import { createSeguimientoAuxiliar, deleteSeguimientoAuxiliar, getAllSeguimientosAuxiliares, getSeguimientoAuxiliar, updateSeguimientoAuxiliar } from "../controllers/seguimiento-auxiliar_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     SeguimientoAuxiliar:
 *       type: object
 *       required:
 *         - observation
 *         - status
 *         - idRadicacion
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del seguimiento auxiliar
 *         observation:
 *           type: string
 *           description: Observación del seguimiento
 *         status:
 *           type: integer
 *           description: Estado del seguimiento
 *         idRadicacion:
 *           type: integer
 *           description: ID de la radicación asociada
 */

/**
 * @swagger
 * /seguimientos-auxiliares:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene todos los seguimientos auxiliares
 *     tags: [Seguimientos Auxiliares]
 *     responses:
 *       200:
 *         description: Lista de seguimientos auxiliares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SeguimientoAuxiliar'
 */
router.get("/seguimientos-auxiliares",authenticate, authorizeRoles(['1', '2', '5']), getAllSeguimientosAuxiliares);


/**
 * @swagger
 * /seguimientos-auxiliares/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene un seguimiento auxiliar por ID
 *     tags: [Seguimientos Auxiliares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seguimiento auxiliar encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeguimientoAuxiliar'
 *       404:
 *         description: Seguimiento auxiliar no encontrado
 */
router.get("/seguimientos-auxiliares/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,getSeguimientoAuxiliar);


/**
 * @swagger
 * /seguimientos-auxiliares:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Crea un nuevo seguimiento auxiliar
 *     tags: [Seguimientos Auxiliares]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observation
 *               - status
 *               - idRadicacion
 *             properties:
 *               observation:
 *                 type: string
 *               status:
 *                 type: integer
 *               idRadicacion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Seguimiento auxiliar creado
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post("/seguimientos-auxiliares",authenticate, authorizeRoles(['1', '2', '10', '6']), createSeguimientoAuxiliar);


/**
 * @swagger
 * /seguimientos-auxiliares/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Actualiza un seguimiento auxiliar
 *     tags: [Seguimientos Auxiliares]
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
 *               observation:
 *                 type: string
 *               status:
 *                 type: integer
 *               codeCups:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seguimiento auxiliar actualizado
 *       404:
 *         description: Seguimiento auxiliar no encontrado
 */
router.put("/seguimientos-auxiliares/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,updateSeguimientoAuxiliar);


/**
 * @swagger
 * /seguimientos-auxiliares/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Elimina un seguimiento auxiliar
 *     tags: [Seguimientos Auxiliares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seguimiento auxiliar eliminado
 *       404:
 *         description: Seguimiento auxiliar no encontrado
 */
router.delete("/seguimientos-auxiliares/:id",authenticate, authorizeRoles(['1']), validarId ,deleteSeguimientoAuxiliar);


export default router;