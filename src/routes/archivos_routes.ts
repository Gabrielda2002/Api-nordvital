import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { uploadSggc } from "../middlewares/multer-config-ssgc";
import { createFile, deleteFile, downloadFile, getAllFiles, getFileById, moveFile, updateFile, generateFileAccessToken, serveSecureFile } from "../controllers/archivo.controller";
import { validarId } from "../middlewares/validar-id";
import { parseParentFolderId } from "../middlewares/parse-parent-folder-id";
import { fileAccessRateLimit } from "../middlewares/file-rate-limit";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Archivo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del archivo
 *         name:
 *           type: string
 *           description: Nombre del archivo
 *         path:
 *           type: string
 *           description: Ruta del archivo en el servidor
 *         size:
 *           type: number
 *           description: Tamaño del archivo en bytes
 *         mimeType:
 *           type: string
 *           description: Tipo MIME del archivo
 *         folderId:
 *           type: integer
 *           description: ID de la carpeta padre
 *         nameSaved:
 *           type: string
 *           description: Nombre con el que se guardó el archivo
 */

/**
 * @swagger
 * /archivo:
 *   get:
 *     summary: Obtiene todos los archivos
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     responses:
 *       200:
 *         description: Lista de archivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archivo'
 *       404:
 *         description: No hay archivos registrados
 */
router.get("/archivo", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']) , getAllFiles);

/**
 * @swagger
 * /archivo/{id}:
 *   get:
 *     summary: Obtiene un archivo por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del archivo
 *     responses:
 *       200:
 *         description: Archivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archivo'
 *       404:
 *         description: Archivo no encontrado
 */
router.get("/archivo/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']),validarId ,getFileById);

/**
 * @swagger
 * /archivo:
 *   post:
 *     summary: Crea un nuevo archivo
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     parameters:
 *       - in: query
 *         name: parentFolderId
 *         schema:
 *           type: integer
 *         description: ID de la carpeta padre si la carpeta que se crea no es una carpeta raiz
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Archivo creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       409:
 *         description: El archivo ya existe
 */
router.post("/archivo", authenticate, authorizeRoles(['1','4']),uploadSggc, parseParentFolderId, createFile);

/**
 * @swagger
 * /archivo/{id}:
 *   put:
 *     summary: Actualiza un archivo existente
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
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
 *               name:
 *                 type: string
 *               parentFolderId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Archivo actualizado exitosamente
 *       404:
 *         description: Archivo no encontrado
 */
router.put("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId, updateFile);

/**
 * @swagger
 * /archivo/{id}:
 *   delete:
 *     summary: Elimina un archivo
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Archivo eliminado exitosamente
 *       404:
 *         description: Archivo no encontrado
 */
router.delete("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId, deleteFile);

/**
 * @swagger
 * /download-file/{id}:
 *   get:
 *     summary: Descarga un archivo
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Archivo descargado exitosamente
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Archivo no encontrado
 */
router.get("/download-file/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16','17','18', '19', '20']),validarId, downloadFile);

/**
 * @swagger
 * /archivos/{id}/move:
 *   put:
 *     summary: Mueve un archivo a otra carpeta
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del archivo a mover
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newParentId
 *             properties:
 *               newParentId:
 *                 type: integer
 *                 description: ID de la carpeta destino
 *     responses:
 *       200:
 *         description: Archivo movido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movedFiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Archivo'
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalFiles:
 *                       type: integer
 *                     movedFilesCount:
 *                       type: integer
 *                     errorsCount:
 *                       type: integer
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Archivo o carpeta destino no encontrado
 *       207:
 *         description: Operación parcialmente exitosa (algunos archivos movidos, otros con errores)
 */
router.put("/archivos/:id/move", authenticate, authorizeRoles(['1', '4']), validarId, moveFile);

/**
 * @swagger
 * /files/{id}/access-token:
 *   post:
 *     summary: Genera un token temporal para acceso seguro a un archivo
 *     security:
 *       - bearerAuth: []
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del archivo
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [VIEW, DOWNLOAD]
 *         description: Acción a realizar (VIEW para visualizar, DOWNLOAD para descargar)
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT temporal
 *                 expiresIn:
 *                   type: integer
 *                   description: Tiempo de expiración en segundos
 *                 url:
 *                   type: string
 *                   description: URL completa para acceder al archivo
 *                 action:
 *                   type: string
 *                   description: Acción autorizada
 *       400:
 *         description: Parámetros inválidos
 *       404:
 *         description: Archivo no encontrado
 *       403:
 *         description: Sin permisos para acceder al archivo
 */
router.post("/files/:id/access-token", fileAccessRateLimit, authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']), validarId, generateFileAccessToken);

/**
 * @swagger
 * /secure-file/{token}:
 *   get:
 *     summary: Accede a un archivo de forma segura usando un token temporal
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT temporal generado previamente
 *     responses:
 *       200:
 *         description: Archivo servido exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Token requerido
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Archivo no encontrado
 */
router.get("/secure-file/:token", serveSecureFile);

export default router;