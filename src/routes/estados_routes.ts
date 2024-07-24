import { Router } from "express";
import { createEstados, deleteEstados, getAllEstados, getEstadosById, updateEstados } from "../controllers/estados_controller";

const router = Router();

router.get("/estados", getAllEstados);

router.get("/estados/:id", getEstadosById);

router.post("/estados", createEstados);

router.put("/estados/:id", updateEstados);

router.delete("/estados/:id", deleteEstados);

export default router;