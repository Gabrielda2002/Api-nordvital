import { Router } from "express";
import { createLugarRadicacion, deleteLugarRadicacion, getAllLugaresRadicacion, getLugarRadicacion, updateLugarRadicacion } from "../controllers/lugar-radicacion_controller";

const router = Router();

router.get("/lugares-radicacion", getAllLugaresRadicacion);

router.get("/lugares-radicacion/:id", getLugarRadicacion);

router.post("/lugares-radicacion", createLugarRadicacion);

router.put("/lugares-radicacion/:id", updateLugarRadicacion);

router.delete("/lugares-radicacion/:id", deleteLugarRadicacion);

export default router;