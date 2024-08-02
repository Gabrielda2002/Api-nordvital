import { Router } from "express";
import { createPermisosRol, deletePermisosRol, getAllPermisosRol, getPermisosRolById, updatePermisosRol } from "../controllers/permisos-rol_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/permisos-rol",authenticate, authorizeRoles(['1']), getAllPermisosRol);

router.get("/permisos-rol/:id",authenticate, authorizeRoles(['1']), validarId, getPermisosRolById);

router.post("/permisos-rol",authenticate, authorizeRoles(['1']), createPermisosRol);

router.put("/permisos-rol/:id",authenticate, authorizeRoles(['1']), validarId, updatePermisosRol);

router.delete("/permisos-rol/:id",authenticate, authorizeRoles(['1']), validarId, deletePermisosRol);

export default router;