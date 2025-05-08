import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { validarId } from "../middlewares/validar-id";
import { createTelevisor, getTelevisorBySedeId, updateTelevisor } from "../controllers/televisor_controller";

const router = Router();

router.get('/inventario/televisores-sede/:id', authenticate, authorizeRoles(['1']), validarId, getTelevisorBySedeId);

router.post('/televisores', authenticate, authorizeRoles(['1']), createTelevisor);

router.put('/televisores/:id', authenticate, authorizeRoles(['1']), validarId, updateTelevisor);

export default router;