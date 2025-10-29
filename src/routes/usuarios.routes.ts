import { Router } from "express";
import { createUsuario, deletePhoto, deleteUsuario, getAllUsuarios, getUsuario, getUsuariosTable, searchUsuarios, updatePassword, updatePasswordGeneric, updateUsuario, updateUsuarioBasicData, updateUsuarioTable, uploadPhoto } from "../controllers/usuario.controller";
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
 *     description: |
 *       Lista todos los usuarios del sistema.
 *       
 *       **Roles permitidos:**
 *       - Administrador (ID: 1)
 *       - Gerente (ID: 2)
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
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (rol no permitido)
 */
router.get('/usuarios', authenticate, authorizeRoles(['1', '2']), getAllUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: |
 *       Consulta la información detallada de un usuario específico.
 *       
 *       **Roles permitidos:**
 *       - Administrador (ID: 1)
 *       - Gerente (ID: 2)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:id', authenticate, authorizeRoles(['1', '2']), validarId, getUsuario);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema y asigna su rol correspondiente.
 *       
 *       **Roles permitidos:**
 *       - Administrador (ID: 1)
 *       - Gerente (ID: 2)
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
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */
router.post('/usuarios', authenticate, authorizeRoles(['1', '2']), createUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: |
 *       Actualiza la información de un usuario existente.
 *       
 *       **Roles permitidos:**
 *       - Administrador (ID: 1)
 *       - Gerente (ID: 2)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/usuarios/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: |
 *       🔴 **ACCIÓN CRÍTICA:** Elimina permanentemente un usuario del sistema.
 *       
 *       **Roles permitidos:** Solo Administrador (ID: 1)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (solo Administrador)
 *       404:
 *         description: Usuario no encontrado
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
router.put('/upload-photo/:id', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18', '19', '20', '21']), uploadPhotoUser.single('photo'), validarId, uploadPhoto);

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
router.delete('/delete-photo/:id', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18', '19', '20']), validarId, deletePhoto);

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
router.put("/usuario-datos-basicos/:id", authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16','17','18',  '19', '20', '21']), validarId, updateUsuarioBasicData);

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
router.put("/usuario-update-password/:id", authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '17', '18', '19', '20', '21']), validarId, updatePassword);

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
router.post("/search-user-by-name", authenticate, authorizeRoles(['1', '2', '6']), searchUsuarios);

/**
 * @swagger
 * /update-password:
 *   put:
 *     summary: Actualizar contraseñas de usuarios a una clave genérica
 *     description: Esta ruta permite actualizar las contraseñas de todos los usuarios con un ID mayor a 72 a una contraseña genérica predefinida.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contraseñas actualizadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseñas actualizadas correctamente
 */
router.put('/update-password', authenticate, authorizeRoles(['1']), updatePasswordGeneric);

export default router;
