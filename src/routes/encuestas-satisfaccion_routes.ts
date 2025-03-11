import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createSurveySatisfaction, deleteSurveySatisfaction, getAllSurveySatisfaction, getSurveySatisfaction, isTicketServey, updateSurveySatisfaction } from "../controllers/encuestas-satisfaccion_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/encuestas-satisfaccion', authenticate, authorizeRoles(['1', '10']), getAllSurveySatisfaction);

router.get('/encuentas-satisfaccion/:id', authenticate, authorizeRoles(['1', '10']),validarId ,getSurveySatisfaction);

router.post('/encuestas-satisfaccion', authenticate, authorizeRoles(['1', '10']), createSurveySatisfaction);

router.put('/encuentas-satisfaccion/:id', authenticate, authorizeRoles(['1', '10']),validarId , updateSurveySatisfaction);

router.delete('/encuentas-satisfaccion/:id', authenticate, authorizeRoles(['1', '10']),validarId , deleteSurveySatisfaction);

router.post('/validate/servey-ticket', authenticate, authorizeRoles(['1', '10']), isTicketServey);

export default router;