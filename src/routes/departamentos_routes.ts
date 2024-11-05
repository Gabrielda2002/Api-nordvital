import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createDepartment, deleteDepartment, getAllDepartments, getDepartment, updateDepartment } from "../controllers/departamentos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/departamentos", authenticate, authorizeRoles(['1']),  getAllDepartments)

router.get("/departamentos/:id", authenticate, authorizeRoles(['1']),  validarId, getDepartment)

router.post("/departamentos", authenticate, authorizeRoles(['1']),  createDepartment)

router.put("/departamentos/:id", authenticate, authorizeRoles(['1']),  validarId, updateDepartment)

router.delete("/departamentos/:id", authenticate, authorizeRoles(['1']),  validarId, deleteDepartment)

export default router;