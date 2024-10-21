import { Router } from "express";
import { createUsuario, deletePhoto, deleteUsuario, getAllUsuarios, getUsuario, getUsuariosTable, updatePassword, updateUsuario, updateUsuarioBasicData, uploadPhoto } from "../controllers/usuario_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { uploadPhotoUser } from "../middlewares/multer-config-photo-user";

const router = Router();

router.get('/usuarios', authenticate, authorizeRoles(['1', '2']), getAllUsuarios);

router.get('/usuarios/:id', authenticate, authorizeRoles(['1', '2']), validarId, getUsuario);

router.post('/usuarios', authenticate, authorizeRoles(['1', '2']), createUsuario);

router.put('/usuarios/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateUsuario);

router.delete('/usuarios/:id', authenticate, authorizeRoles(['1']), validarId, deleteUsuario);

router.put('/upload-photo/:id', authenticate, authorizeRoles(['1', '10', '15']), uploadPhotoUser.single('photo') , validarId, uploadPhoto);

router.delete('/delete-photo/:id', authenticate, authorizeRoles(['1', '10', '15']), validarId, deletePhoto);

router.get('/usuarios-table', authenticate, authorizeRoles(['1', '2']), getUsuariosTable);

router.put("/usuario-datos-basicos/:id", authenticate, authorizeRoles(['1', '3','15', '10']), validarId, updateUsuarioBasicData);

router.put("/usuario-update-password/:id", authenticate, authorizeRoles(['1', '3','15', '10']), validarId, updatePassword);

export default router;
