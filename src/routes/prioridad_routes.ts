import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPriority, deletePriority, getAllPriority, getPriorityById, updatePriority } from "../controllers/prioridad_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/prioridades', authenticate, authorizeRoles(['1']), getAllPriority);

router.get('/prioridades/:id', authenticate, authorizeRoles(['1']), validarId, getPriorityById);

router.post('/prioridades', authenticate, authorizeRoles(['1']), createPriority);

router.put('/prioridades/:id', authenticate, authorizeRoles(['1']), updatePriority);

router.delete('/prioridades/:id', authenticate, authorizeRoles(['1']), validarId, deletePriority);

export default router;