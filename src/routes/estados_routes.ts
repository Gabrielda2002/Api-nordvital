import { Router } from "express";
import { createEstados, deleteEstados, getAllEstados, getEstadosById, updateEstados } from "../controllers/estados_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/estados", getAllEstados);

router.get("/estados/:id",authenticate, authorizeRoles(['1']),validarId , getEstadosById);

router.post("/estados",authenticate, authorizeRoles(['1']), createEstados);

router.put("/estados/:id",authenticate, authorizeRoles(['1']), validarId, updateEstados);

router.delete("/estados/:id",authenticate, authorizeRoles(['1']), validarId, deleteEstados);

export default router;