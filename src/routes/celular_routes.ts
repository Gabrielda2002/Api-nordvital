import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPhone, getPhoneBySedeId } from "../controllers/celular_controller";

const router = Router();

router.get('/celular/:id', authenticate, authorizeRoles(['1']), getPhoneBySedeId);

router.post('/celular', authenticate, authorizeRoles(['1']), createPhone);

export default router;