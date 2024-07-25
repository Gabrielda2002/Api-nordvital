import { Router } from "express";
import { createLugarRadicacion, deleteLugarRadicacion, getAllLugaresRadicacion, getLugarRadicacion, updateLugarRadicacion } from "../controllers/lugar-radicacion_controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get("/lugares-radicacion", getAllLugaresRadicacion);

router.get("/lugares-radicacion/:id",validarId , getLugarRadicacion);

router.post("/lugares-radicacion", createLugarRadicacion);

router.put("/lugares-radicacion/:id",validarId ,updateLugarRadicacion);

router.delete("/lugares-radicacion/:id",validarId ,deleteLugarRadicacion);

export default router;