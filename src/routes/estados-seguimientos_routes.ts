import { Router } from "express";
import { createEstadosSeguimiento, deleteEstadosSeguimiento, getEstadosSeguimiento, getEstadosSeguimientos, updateEstadosSeguimiento } from "../controllers/estados-seguimientos_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

router.get("/estados-seguimientos",authenticate, authorizeRoles(['1', '2']), getEstadosSeguimientos);

router.get("/estados-seguimientos/:id",validarId , authenticate, authorizeRoles(['1', '2']),getEstadosSeguimiento);

router.post("/estados-seguimientos",authenticate, authorizeRoles(['1', '2']),createEstadosSeguimiento);

router.put("/estados-seguimientos/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateEstadosSeguimiento);

router.delete("/estados-seguimientos/:id",authenticate, authorizeRoles(['1']),validarId ,deleteEstadosSeguimiento);

export default router;