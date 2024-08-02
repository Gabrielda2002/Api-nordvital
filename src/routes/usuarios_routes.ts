import { Router } from "express";
import { createUsuario, deleteUsuario, getAllUsuarios, getUsuario, updateUsuario } from "../controllers/usuario_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/usuarios', authenticate, authorizeRoles(["1"]), getAllUsuarios);
router.get('/usuarios/:id', authenticate, authorizeRoles(['1']), validarId, getUsuario);

router.post('/usuarios', authenticate, authorizeRoles(['1']), createUsuario);

router.put('/usuarios/:id', authenticate, authorizeRoles(['1']), validarId, updateUsuario);

router.delete('/usuarios/:id', authenticate, authorizeRoles(['1']), validarId, deleteUsuario);

export default router;
