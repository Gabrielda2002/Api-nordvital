import { Router } from "express";
import { createLugarRadicacion, deleteLugarRadicacion, getAllLugaresRadicacion, getLugarRadicacion, updateLugarRadicacion } from "../controllers/lugar-radicacion_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/lugares-radicacion",authenticate, authorizeRoles(['1', '2']), getAllLugaresRadicacion);

router.get("/lugares-radicacion/:id",authenticate, authorizeRoles(['1', '2']),validarId , getLugarRadicacion);

router.post("/lugares-radicacion",authenticate, authorizeRoles(['1', '2']), createLugarRadicacion);

router.put("/lugares-radicacion/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateLugarRadicacion);

router.delete("/lugares-radicacion/:id",authenticate, authorizeRoles(['1']),validarId ,deleteLugarRadicacion);

export default router;