import { Router } from "express";
import { createPaciente, deletePaciente, getAllPacientes, getPaciente, updatePaciente } from "../controllers/pacientes_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

router.get("/pacientes",authenticate, authorizeRoles(['1']), getAllPacientes);

router.get("/pacientes/:id", validarId, getPaciente);

router.post("/pacientes",authenticate, authorizeRoles(['1']), createPaciente);

router.put("/pacientes/:id",authenticate, authorizeRoles(['1']), validarId, updatePaciente);

router.delete("/pacientes/:id",authenticate, authorizeRoles(['1']), validarId, deletePaciente);

export default router;