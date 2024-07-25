import { Router } from "express";
import { createEspecialidad, deleteEspecialidad, getAllEspecialidades, getEspecialidad, updateEspecialidad } from "../controllers/especialidad_controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get("/especialidades", getAllEspecialidades);

router.get("/especialidades/:id", validarId, getEspecialidad);

router.post("/especialidades", createEspecialidad);

router.put("/especialidades/:id", validarId,updateEspecialidad);

router.delete("/especialidades/:id", validarId, deleteEspecialidad);

export default router;