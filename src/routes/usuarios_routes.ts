import { Router } from "express";
import { createUsuario, deleteUsuario, getAllUsuarios, getUsuario, updateUsuario } from "../controllers/usuario_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/usuarios', getAllUsuarios);

router.get('/usuarios/:id', validarId, getUsuario);

router.post('/usuarios', createUsuario);

router.put('/usuarios/:id', validarId, updateUsuario);

router.delete('/usuarios/:id', validarId, deleteUsuario);

export default router;