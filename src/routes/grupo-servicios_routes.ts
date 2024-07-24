import { Router } from "express";
import { createGrupoServicios, deleteGrupoServicios, getAllGruposServicios, getGrupoServicios, updateGrupoServicios } from "../controllers/grupo-servicios_controller";

const router = Router();

router.get("/grupo-servicios", getAllGruposServicios);

router.get("/grupo-servicios/:id", getGrupoServicios);

router.post("/grupo-servicios", createGrupoServicios);

router.put("/grupo-servicios/:id", updateGrupoServicios);

router.delete("/grupo-servicios/:id", deleteGrupoServicios);

export default router;