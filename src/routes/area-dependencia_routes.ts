import { Router } from "express";
import { getAllAreaDependency } from "../controllers/area-dependencia_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/area-dependencia', authenticate, authorizeRoles(['1', '6', '4']), getAllAreaDependency);

export default router;