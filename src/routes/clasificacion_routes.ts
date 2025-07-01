import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllClassifications } from "../controllers/clasificacion_controllers";

const router = Router();

router.get('/clasificaciones', authenticate, authorizeRoles(['1', '6','4']), getAllClassifications);

export default router;