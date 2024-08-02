import { Router } from "express";
import { createPermiso, deletePermiso, getAllPermisos, getPermiso, updatePermiso } from "../controllers/permisos_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/permisos",authenticate, authorizeRoles(['1']), getAllPermisos);

router.get("/permisos/:id",authenticate, authorizeRoles(['1']), validarId, getPermiso);

router.post("/permisos",authenticate, authorizeRoles(['1']), createPermiso);

router.put("/permisos/:id",authenticate, authorizeRoles(['1']), validarId, updatePermiso);

router.delete("/permisos/:id",authenticate, authorizeRoles(['1']), validarId, deletePermiso);

export default router;