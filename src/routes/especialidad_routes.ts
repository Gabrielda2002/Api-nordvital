import { Router } from "express";
import { createEspecialidad, deleteEspecialidad, getAllEspecialidades, getEspecialidad, getEspecialidadesByName, updateEspecialidad } from "../controllers/especialidad_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/especialidades", getAllEspecialidades);

router.get("/especialidades/:id",authenticate, authorizeRoles(['1', '2']), validarId, getEspecialidad);

router.post("/especialidades",authenticate, authorizeRoles(['1', '2']), createEspecialidad);

router.put("/especialidades/:id",authenticate, authorizeRoles(['1', '2']), validarId,updateEspecialidad);

router.delete("/especialidades/:id",authenticate, authorizeRoles(['1']), validarId, deleteEspecialidad);

router.post("/especialidades-name",authenticate, authorizeRoles(['1', '2']), getEspecialidadesByName);

export default router;