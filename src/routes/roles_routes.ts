import { Router } from "express";
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from "../controllers/roles_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/roles", getAllRoles);

router.get("/roles/:id", validarId ,getRole);

router.post("/roles", createRole);

router.put("/roles/:id", validarId ,updateRole);

router.delete("/roles/:id", validarId ,deleteRole);

export default router;