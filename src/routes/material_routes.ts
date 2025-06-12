import { Router } from "express";
import { getAllMaterials } from "../controllers/materiales_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/materiales', authenticate, authorizeRoles(['1', '6']), getAllMaterials);

export default router;