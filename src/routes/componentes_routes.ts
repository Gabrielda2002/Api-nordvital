import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createComponent, deleteComponent, getAllComponents, getComponent, updateComponent } from "../controllers/componentes_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/componentes", authenticate, authorizeRoles(["1"]), getAllComponents);

router.get("/componentes/:id", authenticate, authorizeRoles(["1"]),validarId ,getComponent);

router.post("/componentes", authenticate, authorizeRoles(["1"]), createComponent);

router.put("/componentes/:id", authenticate, authorizeRoles(["1"]), validarId, updateComponent);

router.delete("/componentes/:id", authenticate, authorizeRoles(["1"]), validarId, deleteComponent);

export default router;