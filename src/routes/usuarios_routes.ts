import { Router } from "express";
import { createUsuario, deletePhoto, deleteUsuario, getAllUsuarios, getUsuario, getUsuariosTable, searchUsuarios, updatePassword, updateUsuario, updateUsuarioBasicData, updateUsuarioTable, uploadPhoto } from "../controllers/usuario_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { uploadPhotoUser } from "../middlewares/multer-config-photo-user";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/usuarios', authenticate, authorizeRoles(['1', '2']), getAllUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
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
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:id', authenticate, authorizeRoles(['1', '2']), validarId, getUsuario);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 */
router.post('/usuarios', authenticate, authorizeRoles(['1', '2']), createUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
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
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
router.put('/usuarios/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado exitosamente
 */
router.delete('/usuarios/:id', authenticate, authorizeRoles(['1']), validarId, deleteUsuario);

/**
 * @swagger
 * /upload-photo/{id}:
 *   put:
 *     summary: Actualizar foto de perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada exitosamente
 */
router.put('/upload-photo/:id', authenticate, authorizeRoles(['1', '10', '15']), uploadPhotoUser.single('photo'), validarId, uploadPhoto);

/**
 * @swagger
 * /delete-photo/{id}:
 *   delete:
 *     summary: Eliminar foto de perfil
 *     tags: [Usuarios]
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
 *         description: Foto eliminada exitosamente
 */
router.delete('/delete-photo/:id', authenticate, authorizeRoles(['1', '3', '4', '10', '15']), validarId, deletePhoto);

/**
 * @swagger
 * /usuarios-table:
 *   get:
 *     summary: Obtener tabla de usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tabla de usuarios obtenida exitosamente
 */
router.get('/usuarios-table', authenticate, authorizeRoles(['1', '2']), getUsuariosTable);

/**
 * @swagger
 * /usuario-datos-basicos/{id}:
 *   put:
 *     summary: Actualizar datos básicos del usuario
 *     tags: [Usuarios]
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
 *             required: [name, lastName, email]
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos actualizados exitosamente
 */
router.put("/usuario-datos-basicos/:id", authenticate, authorizeRoles(['1', '3', '4', '15', '10']), validarId, updateUsuarioBasicData);

/**
 * @swagger
 * /usuario-update-password/{id}:
 *   put:
 *     summary: Actualizar contraseña del usuario
 *     tags: [Usuarios]
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
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 */
router.put("/usuario-update-password/:id", authenticate, authorizeRoles(['1', '3', '4', '15', '10']), validarId, updatePassword);

/**
 * @swagger
 * /usuario-update-table/{id}:
 *   put:
 *     summary: Actualizar tabla de usuario
 *     tags: [Usuarios]
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
 *             required: [tableData]
 *             properties:
 *               tableData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Tabla de usuario actualizada exitosamente
 */
router.put("/usuario-update-table/:id", authenticate, authorizeRoles(['1']), validarId, updateUsuarioTable);

/**
 * @swagger
 * /search-user-by-name:
 *   post:
 *     summary: Buscar usuario por nombre
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.post("/search-user-by-name", authenticate, authorizeRoles(['1', '2']), searchUsuarios);

export default router;
