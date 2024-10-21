import { Router } from "express";
import { createPaciente, deletePaciente, getAllPacientes, getPaciente, getPacientesByDocument, updatePaciente, updatePacienteTable } from "../controllers/pacientes_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

router.get("/pacientes",authenticate, authorizeRoles(['1', '2', '3' , '5']), getAllPacientes);

router.get("/pacientes/:id", authenticate, authorizeRoles(['1', '2', '3' , '5']),validarId, getPaciente);

router.post("/pacientes",authenticate, authorizeRoles(['1', '2', '3' , '5']), createPaciente);

router.put("/pacientes/:id",authenticate, authorizeRoles(['1', '2', '3' , '5', '15']), validarId, updatePaciente);

router.delete("/pacientes/:id",authenticate, authorizeRoles(['1']), validarId, deletePaciente);

router.post("/pacientes-documento",authenticate, authorizeRoles(['1', '2', '3' , '5', '15']), getPacientesByDocument);

router.put("/pacientes-actualizar-tablet/:id",authenticate, authorizeRoles(['1', '2', '3' , '5']), validarId, updatePacienteTable);

export default router;