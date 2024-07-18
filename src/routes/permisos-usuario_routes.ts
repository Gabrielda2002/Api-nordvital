import { Router } from "express";
import { getAllPermisosUsuarios } from "../controllers/permisos-usuario_controller";

const router = Router();

router.get('/permisos-usuario', getAllPermisosUsuarios)

export default router;
