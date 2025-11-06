import { Router  } from "express";
import { createDocumentType, deleteDocumentType, getAllDocumentType, getDocumentTypeById, updateDocumentType, updateStatusDocumentType } from "../controllers/tipo-documento.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";


const router = Router();
// Definición del esquema
/**
 * @swagger
 * components:
 *  schemas:
 *    TipoDocumento:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: integer
 *          description: ID del tipo de documento
 *        name:
 *          type: string
 *          description: Nombre del tipo de documento
 *        status:
 *          type: boolean
 *          description: Estado del tipo de documento
 */

/**
 * @swagger
 * /documento:
 *   get:
 *     summary: Obtiene todos los tipos de documento
 *     tags: [Tipos de Documento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de documento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumento'
 *       401:
 *         description: No autorizado
 */
router.get('/documento',authenticate, authorizeRoles(['1' , '3', '10', '15', '6', '19', '20', '21']), getAllDocumentType);

/**
 * @swagger
 * /documento/{id}:
 *   get:
 *     summary: Obtiene un tipo de documento por ID
 *     tags: [Tipos de Documento]
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
 *         description: Tipo de documento encontrado
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.get('/documento/:id',authenticate, authorizeRoles(['1' , '2']), validarId, getDocumentTypeById);

/**
 * @swagger
 * /documento:
 *   post:
 *     summary: Crea un nuevo tipo de documento
 *     tags: [Tipos de Documento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo de documento creado
 *       409:
 *         description: El tipo de documento ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/documento',authenticate, authorizeRoles(['1' , '2']), createDocumentType);

/**
 * @swagger
 * /documento/{id}:
 *   put:
 *     summary: Actualiza un tipo de documento
 *     tags: [Tipos de Documento]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.put('/documento/:id',authenticate, authorizeRoles(['1' , '2']), validarId, updateDocumentType);

/**
 * @swagger
 * /documento/{id}:
 *   delete:
 *     summary: Elimina un tipo de documento
 *     tags: [Tipos de Documento]
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
 *         description: Tipo de documento eliminado
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.delete('/documento/:id',authenticate, authorizeRoles(['1']), validarId, deleteDocumentType);

/**
 * @swagger
 * /update-status-documento/{id}:
 *   put:
 *     summary: Actualiza el estado de un tipo de documento
 *     tags: [Tipos de Documento]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado del tipo de documento actualizado
 *       404:
 *         description: Tipo de documento no encontrado
 */
router.put("/update-status-documento/:id",authenticate, authorizeRoles(['1']), validarId, updateStatusDocumentType);

export default router;
