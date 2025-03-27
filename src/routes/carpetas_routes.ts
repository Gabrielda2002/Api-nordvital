import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createFolder, deleteFolder, getAllFolders, getFolderById, getSgcFoldersFiles, updateFolder } from "../controllers/carpeta_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Carpeta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         path:
 *           type: string
 *         parentFolderId:
 *           type: integer
 *           nullable: true
 *         idMunicipio:
 *           type: integer
 *         userId:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /carpetas:
 *   get:
 *     summary: Obtiene todas las carpetas
 *     tags: [Carpetas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carpetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carpeta'
 */
router.get('/carpetas',authenticate , authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), getAllFolders);

/**
 * @swagger
 * /carpetas/{id}:
 *   get:
 *     summary: Obtiene una carpeta por ID
 *     tags: [Carpetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la carpeta
 *     responses:
 *       200:
 *         description: Carpeta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carpeta'
 *       404:
 *         description: Carpeta no encontrada
 */
router.get('/carpetas/:id',authenticate , authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16' ]), validarId, getFolderById);

/**
 * @swagger
 * /carpetas:
 *   post:
 *     summary: Crea una nueva carpeta
 *     tags: [Carpetas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderName:
 *                 type: string
 *               municipio:
 *                 type: integer
 *               parentFolderId:
 *                 type: integer
 *                 nullable: true
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Carpeta creada
 *       409:
 *         description: La carpeta ya existe
 *       404:
 *         description: Carpeta padre no encontrada
 */
router.post('/carpetas', authenticate, authorizeRoles(['1', '4' ]), createFolder);

/**
 * @swagger
 * /carpetas/{id}:
 *   put:
 *     summary: Actualiza una carpeta existente
 *     tags: [Carpetas]
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
 *               parentFolderId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Carpeta actualizada
 *       404:
 *         description: Carpeta no encontrada
 *       409:
 *         description: Ya existe una carpeta con ese nombre
 */
router.put('/carpetas/:id',authenticate , authorizeRoles(['1', '4' ]), validarId, updateFolder);

/**
 * @swagger
 * /carpetas/{id}:
 *   delete:
 *     summary: Elimina una carpeta
 *     tags: [Carpetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Carpeta eliminada
 *       404:
 *         description: Carpeta no encontrada
 *       400:
 *         description: La carpeta tiene archivos o subcarpetas
 */
router.delete('/carpetas/:id',authenticate , authorizeRoles(['1', '4']), validarId, deleteFolder);

/**
 * @swagger
 * /sistema-calidad/{id}:
 *   get:
 *     summary: Obtiene carpetas y archivos del sistema de calidad
 *     tags: [Carpetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: Municipio
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de carpetas y archivos
 *       404:
 *         description: Carpeta no encontrada
 */
router.get('/sistema-calidad/:id?' , authenticate , authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18']), getSgcFoldersFiles);

export default router;