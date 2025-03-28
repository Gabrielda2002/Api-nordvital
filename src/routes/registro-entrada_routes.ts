import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getRegisterEntriesByDocument } from "../controllers/registro-entrada_controllers";

const router = Router();

router.post('/registro-entrada', authenticate, authorizeRoles(['1', '18']), getRegisterEntriesByDocument);

export default router;