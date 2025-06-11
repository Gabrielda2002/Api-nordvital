import { Router } from "express";
import { getAllAssetTypes } from "../controllers/tipo-activo_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/tipo-activo', authenticate, authorizeRoles(['1', '6']), getAllAssetTypes);

export default router;