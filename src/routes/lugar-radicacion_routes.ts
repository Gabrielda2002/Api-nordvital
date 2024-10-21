import { Router } from "express";
import { createLugarRadicacion, deleteLugarRadicacion, getAllLugaresRadicacion, getLugaresRadicacionByName, getLugarRadicacion, updateLugarRadicacion, updateStatusLugarRadicacion } from "../controllers/lugar-radicacion_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/lugares-radicacion",authenticate, authorizeRoles(['1', '2']), getAllLugaresRadicacion);

router.get("/lugares-radicacion/:id",authenticate, authorizeRoles(['1', '2']),validarId , getLugarRadicacion);

router.post("/lugares-radicacion",authenticate, authorizeRoles(['1', '2']), createLugarRadicacion);

router.put("/lugares-radicacion/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateLugarRadicacion);

router.delete("/lugares-radicacion/:id",authenticate, authorizeRoles(['1']),validarId ,deleteLugarRadicacion);

router.post("/lugares-radicacion-name",authenticate, authorizeRoles(['1', '10','15']), getLugaresRadicacionByName);

router.put("/update-lugar-status/:id",authenticate, authorizeRoles(['1', '2']),validarId , updateStatusLugarRadicacion);

export default router;