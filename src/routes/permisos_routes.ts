import { Router } from "express";
import { createPermiso, deletePermiso, getAllPermisos, getPermiso, updatePermiso } from "../controllers/permisos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/permisos", getAllPermisos);

router.get("/permisos/:id", validarId, getPermiso);

router.post("/permisos", createPermiso);

router.put("/permisos/:id", validarId, updatePermiso);

router.delete("/permisos/:id", validarId, deletePermiso);

export default router;