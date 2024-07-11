import { Router } from "express";
import { getEstadosSeguimientos } from "../controllers/estados-seguimientos_controller";

const router = Router();

router.get("/estados-seguimientos", getEstadosSeguimientos);

export default router;