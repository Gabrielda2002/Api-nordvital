import { Router } from "express";
import { createEstadosSeguimiento, deleteEstadosSeguimiento, getEstadosSeguimiento, getEstadosSeguimientos, updateEstadosSeguimiento } from "../controllers/estados-seguimientos_controller";

const router = Router();

router.get("/estados-seguimientos", getEstadosSeguimientos);

router.get("/estados-seguimientos/:id", getEstadosSeguimiento);

router.post("/estados-seguimientos", createEstadosSeguimiento);

router.put("/estados-seguimientos/:id", updateEstadosSeguimiento);

router.delete("/estados-seguimientos/:id", deleteEstadosSeguimiento);

export default router;