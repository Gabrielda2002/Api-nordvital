import { Router } from "express";
import { createEspecialidad, deleteEspecialidad, getAllEspecialidades, getEspecialidad, updateEspecialidad } from "../controllers/especialidad_controller";

const router = Router();

router.get("/especialidades", getAllEspecialidades);

router.get("/especialidades/:id", getEspecialidad);

router.post("/especialidades", createEspecialidad);

router.put("/especialidades/:id", updateEspecialidad);

router.delete("/especialidades/:id", deleteEspecialidad);

export default router;