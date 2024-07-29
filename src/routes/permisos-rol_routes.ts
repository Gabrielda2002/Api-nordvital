import { Router } from "express";
import { createPermisosRol, deletePermisosRol, getAllPermisosRol, getPermisosRolById, updatePermisosRol } from "../controllers/permisos-rol_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/permisos-rol", getAllPermisosRol);

router.get("/permisos-rol/:id", validarId, getPermisosRolById);

router.post("/permisos-rol", createPermisosRol);

router.put("/permisos-rol/:id", validarId, updatePermisosRol);

router.delete("/permisos-rol/:id", validarId, deletePermisosRol);

export default router;