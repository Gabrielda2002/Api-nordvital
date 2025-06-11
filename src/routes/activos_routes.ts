import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { validarId } from "../middlewares/validar-id";
import { getAllByAssetId } from "../controllers/activos_controller";

const router = Router();

router.get('/activos/:id', authenticate, authorizeRoles(['1', '6']),validarId ,getAllByAssetId);

export default router;