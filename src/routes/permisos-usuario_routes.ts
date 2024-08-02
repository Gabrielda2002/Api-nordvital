import { Router } from "express";
import { createPermisoUsuario, deletePermisoUsuario, getAllPermisosUsuarios, getPermisoUsuario, updatePermisoUsuario } from "../controllers/permisos-usuario_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/permisos-usuario',authenticate, authorizeRoles(['1']), getAllPermisosUsuarios)

router.get('/permisos-usuario/:id',authenticate, authorizeRoles(['1']), validarId, getPermisoUsuario)

router.post('/permisos-usuario',authenticate, authorizeRoles(['1']), createPermisoUsuario)

router.put('/permisos-usuario/:id',authenticate, authorizeRoles(['1']), validarId, updatePermisoUsuario)

router.delete('/permisos-usuario/:id',authenticate, authorizeRoles(['1']), validarId, deletePermisoUsuario)

export default router;
