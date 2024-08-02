import { Router } from "express";
import { createEspecialidad, deleteEspecialidad, getAllEspecialidades, getEspecialidad, updateEspecialidad } from "../controllers/especialidad_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/especialidades", getAllEspecialidades);

router.get("/especialidades/:id",authenticate, authorizeRoles(['1']), validarId, getEspecialidad);

router.post("/especialidades",authenticate, authorizeRoles(['1']), createEspecialidad);

router.put("/especialidades/:id",authenticate, authorizeRoles(['1']), validarId,updateEspecialidad);

router.delete("/especialidades/:id",authenticate, authorizeRoles(['1']), validarId, deleteEspecialidad);

export default router;