import { Router } from "express";
import { getAllEspecialidades } from "../controllers/especialidad_controller";

const router = Router();

router.get("/especialidades", getAllEspecialidades);

export default router;