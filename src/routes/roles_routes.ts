import { Router } from "express";
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from "../controllers/roles_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

router.get("/roles",authenticate, authorizeRoles(['1', '2']), getAllRoles);

router.get("/roles/:id",authenticate, authorizeRoles(['1', '2']), validarId ,getRole);

router.post("/roles",authenticate, authorizeRoles(['1', '2']), createRole);

router.put("/roles/:id",authenticate, authorizeRoles(['1']), validarId ,updateRole);

router.delete("/roles/:id",authenticate, authorizeRoles(['1']), validarId ,deleteRole);

export default router;