import { Router } from "express";
import { getAllPermisosRol } from "../controllers/permisos-rol_controller";

const router = Router();

router.get("/permisos-rol", getAllPermisosRol);

export default router;