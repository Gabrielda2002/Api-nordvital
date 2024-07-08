import { Router } from "express";
import { getAllGruposServicios } from "../controllers/grupo-servicios_controller";

const router = Router();

router.get("/grupo-servicios", getAllGruposServicios);

export default router;