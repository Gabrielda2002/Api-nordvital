import { Router } from "express";
import { createEstadosSeguimiento, deleteEstadosSeguimiento, getEstadosSeguimiento, getEstadosSeguimientos, updateEstadosSeguimiento } from "../controllers/estados-seguimientos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/estados-seguimientos", getEstadosSeguimientos);

router.get("/estados-seguimientos/:id",validarId ,getEstadosSeguimiento);

router.post("/estados-seguimientos",createEstadosSeguimiento);

router.put("/estados-seguimientos/:id",validarId ,updateEstadosSeguimiento);

router.delete("/estados-seguimientos/:id",validarId ,deleteEstadosSeguimiento);

export default router;