import { Router } from "express";
import { createUsuario, deleteUsuario, getAllUsuarios, getUsuario, updateUsuario } from "../controllers/usuario_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/auto";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/usuarios', authenticate, authorizeRoles(["1"]) ,getAllUsuarios);

router.get('/usuarios/:id', authenticate, authorizeRoles(['Administrador'])  ,validarId, getUsuario);

router.post('/usuarios', createUsuario);

router.put('/usuarios/:id', validarId, updateUsuario);

router.delete('/usuarios/:id', validarId, deleteUsuario);

export default router;