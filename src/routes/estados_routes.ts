import { Router } from "express";
import { createEstados, deleteEstados, getAllEstados, getEstadosById, updateEstados } from "../controllers/estados_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/estados", getAllEstados);

router.get("/estados/:id",validarId , getEstadosById);

router.post("/estados", createEstados);

router.put("/estados/:id", validarId, updateEstados);

router.delete("/estados/:id", validarId, deleteEstados);

export default router;