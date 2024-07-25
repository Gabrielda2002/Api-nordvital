import { Router } from "express";
import { createCupsRadicados, deleteCupsRadicados, getAllCupsRadicados, getCupsRadicados, updateCupsRadicados } from "../controllers/cups-radicados_controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get("/cups-radicados", getAllCupsRadicados);

router.get("/cups-radicados/:id", validarId, getCupsRadicados);

router.post("/cups-radicados", createCupsRadicados)

router.put("/cups-radicados/:id", validarId,updateCupsRadicados);

router.delete("/cups-radicados/:id", validarId,deleteCupsRadicados);

export default router;