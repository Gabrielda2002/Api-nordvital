import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createProcessTelevisor } from "../controllers/seguimiento-televisores_controller";

const router = Router();

router.post('/seguimiento/televisor', authenticate, authorizeRoles(['1']), createProcessTelevisor);

export default router;