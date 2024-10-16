import { Router } from "express";
import { createRadicador, deleteRadicador, getAllRadicador, getRadicador, updateRadicador, updateStatusRadicador } from "../controllers/radicador_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

router.get("/radicador",authenticate, authorizeRoles(['1', '2', '10']), getAllRadicador);

router.get("/radicador/:id",authenticate, authorizeRoles(['1', '2']), validarId, getRadicador);

router.post("/radicador",authenticate, authorizeRoles(['1', '2']), createRadicador);

router.put("/radicador/:id",authenticate, authorizeRoles(['1', '2']), validarId, updateRadicador);

router.delete("/radicador/:id",authenticate, authorizeRoles(['1']), validarId, deleteRadicador);

router.put("/update-status-radicador/:id",authenticate, authorizeRoles(['1', '2']), validarId, updateStatusRadicador);

export default router;