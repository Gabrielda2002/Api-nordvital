import { Router } from "express";
import { getAllAreaTypes } from "../controllers/tipo-area_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/tipo-area', authenticate, authorizeRoles(['1','6','4']), getAllAreaTypes);

export default router;