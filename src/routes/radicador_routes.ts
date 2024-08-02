import { Router } from "express";
import { createRadicador, deleteRadicador, getAllRadicador, getRadicador, updateRadicador } from "../controllers/radicador_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

router.get("/radicador",authenticate, authorizeRoles(['1']), getAllRadicador);

router.get("/radicador/:id",authenticate, authorizeRoles(['1']), validarId, getRadicador);

router.post("/radicador",authenticate, authorizeRoles(['1']), createRadicador);

router.put("/radicador/:id",authenticate, authorizeRoles(['1']), validarId, updateRadicador);

router.delete("/radicador/:id",authenticate, authorizeRoles(['1']), validarId, deleteRadicador);

export default router;