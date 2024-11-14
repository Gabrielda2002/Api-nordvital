import { Router } from "express";
import { createGrupoServicios, deleteGrupoServicios, getAllGruposServicios, getGrupoServicios, getGrupoServiciosByName, updateGrupoServicios } from "../controllers/grupo-servicios_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/grupo-servicios",authenticate, authorizeRoles(['1', '2']), getAllGruposServicios);

router.get("/grupo-servicios/:id",authenticate, authorizeRoles(['1', '2']),validarId ,getGrupoServicios);

router.post("/grupo-servicios" ,authenticate, authorizeRoles(['1', '2']),createGrupoServicios);

router.put("/grupo-servicios/:id",validarId ,authenticate, authorizeRoles(['1', '2']), updateGrupoServicios);

router.delete("/grupo-servicios/:id",validarId ,authenticate, authorizeRoles(['1']),deleteGrupoServicios);

router.post("/grupo-servicios-name" ,authenticate, authorizeRoles(['1', '3','10','15', '6']), getGrupoServiciosByName);

export default router;