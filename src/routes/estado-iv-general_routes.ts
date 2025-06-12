import { Router } from "express";
import { getAllStatusIVGeneral } from "../controllers/estado-iv-general_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/estado/iv-general', authenticate, authorizeRoles(['1', '6']), getAllStatusIVGeneral);

export default router;