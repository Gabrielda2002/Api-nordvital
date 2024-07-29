import { Router } from "express";
import { createRadicador, deleteRadicador, getAllRadicador, getRadicador, updateRadicador } from "../controllers/radicador_controller";
import { validarId } from "../middlewares/validar-id";


const router = Router();

router.get("/radicador", getAllRadicador);

router.get("/radicador/:id", validarId, getRadicador);

router.post("/radicador", createRadicador);

router.put("/radicador/:id", validarId, updateRadicador);

router.delete("/radicador/:id", validarId, deleteRadicador);

export default router;