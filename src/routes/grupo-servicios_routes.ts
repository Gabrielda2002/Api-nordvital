import { Router } from "express";
import { createGrupoServicios, deleteGrupoServicios, getAllGruposServicios, getGrupoServicios, updateGrupoServicios } from "../controllers/grupo-servicios_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/grupo-servicios",authenticate, authorizeRoles(['1']), getAllGruposServicios);

router.get("/grupo-servicios/:id",authenticate, authorizeRoles(['1']),validarId ,getGrupoServicios);

router.post("/grupo-servicios" ,authenticate, authorizeRoles(['1']),createGrupoServicios);

router.put("/grupo-servicios/:id",validarId ,authenticate, authorizeRoles(['1']), updateGrupoServicios);

router.delete("/grupo-servicios/:id",validarId ,authenticate, authorizeRoles(['1']),deleteGrupoServicios);

export default router;