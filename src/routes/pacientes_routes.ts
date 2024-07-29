import { Router } from "express";
import { createPaciente, deletePaciente, getAllPacientes, getPaciente, updatePaciente } from "../controllers/pacientes_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/pacientes", getAllPacientes);

router.get("/pacientes/:id", validarId, getPaciente);

router.post("/pacientes", createPaciente);

router.put("/pacientes/:id", validarId, updatePaciente);

router.delete("/pacientes/:id", validarId, deletePaciente);

export default router;