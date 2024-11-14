import { Router } from "express";
import { createEspecialidad, deleteEspecialidad, getAllEspecialidades, getEspecialidad, getEspecialidadesByName, updateEspecialidad, updateStatusEspecialidad } from "../controllers/especialidad_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/especialidades", getAllEspecialidades);

router.get("/especialidades/:id",authenticate, authorizeRoles(['1', '2']), validarId, getEspecialidad);

router.post("/especialidades",authenticate, authorizeRoles(['1', '2']), createEspecialidad);

router.put("/especialidades/:id",authenticate, authorizeRoles(['1', '2']), validarId,updateEspecialidad);

router.delete("/especialidades/:id",authenticate, authorizeRoles(['1']), validarId, deleteEspecialidad);

router.post("/especialidades-name",authenticate, authorizeRoles(['1', '3','10','15', '6']), getEspecialidadesByName);

router.put("/update-status-especialidad/:id",authenticate, authorizeRoles(['1', '2']), validarId, updateStatusEspecialidad);  

export default router;