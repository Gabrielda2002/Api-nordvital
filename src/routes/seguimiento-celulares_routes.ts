import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createProcessPhone } from "../controllers/seguimiento-celulares_controller";

const router = Router();

router.post('/seguimiento/celulares',authenticate ,authorizeRoles(['1']), createProcessPhone);

export default router;