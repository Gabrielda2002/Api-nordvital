import { Router } from "express";
import { createGrupoServicios, deleteGrupoServicios, getAllGruposServicios, getGrupoServicios, updateGrupoServicios } from "../controllers/grupo-servicios_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/grupo-servicios", getAllGruposServicios);

router.get("/grupo-servicios/:id",validarId ,getGrupoServicios);

router.post("/grupo-servicios" ,createGrupoServicios);

router.put("/grupo-servicios/:id",validarId , updateGrupoServicios);

router.delete("/grupo-servicios/:id",validarId ,deleteGrupoServicios);

export default router;