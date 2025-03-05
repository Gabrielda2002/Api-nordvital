import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createSurveySatisfaction, deleteSurveySatisfaction, getAllSurveySatisfaction, getSurveySatisfaction, updateSurveySatisfaction } from "../controllers/encuestas-satisfaccion_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/encuentas-satisfaccion', authenticate, authorizeRoles, getAllSurveySatisfaction);

router.get('/encuentas-satisfaccion/:id', authenticate, authorizeRoles,validarId ,getSurveySatisfaction);

router.post('/encuentas-satisfaccion', authenticate, authorizeRoles, createSurveySatisfaction);

router.put('/encuentas-satisfaccion/:id', authenticate, authorizeRoles,validarId , updateSurveySatisfaction);

router.delete('/encuentas-satisfaccion/:id', authenticate, authorizeRoles,validarId , deleteSurveySatisfaction);

export default router;