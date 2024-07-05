import { Router } from "express";
import { getAllLugaresRadicacion } from "../controllers/lugar-radicacion_controller";

const router = Router();

router.get("/lugares-radicacion", getAllLugaresRadicacion);

export default router;