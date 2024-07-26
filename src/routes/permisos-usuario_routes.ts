import { Router } from "express";
import { createPermisoUsuario, deletePermisoUsuario, getAllPermisosUsuarios, getPermisoUsuario, updatePermisoUsuario } from "../controllers/permisos-usuario_controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get('/permisos-usuario', getAllPermisosUsuarios)

router.get('/permisos-usuario/:id', validarId, getPermisoUsuario)

router.post('/permisos-usuario', createPermisoUsuario)

router.put('/permisos-usuario/:id', validarId, updatePermisoUsuario)

router.delete('/permisos-usuario/:id', validarId, deletePermisoUsuario)

export default router;
