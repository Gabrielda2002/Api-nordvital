import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllObjetiveDemandInduced, getObjetiveDemandInducedByName } from "../controllers/objetivo-demanda-inducida.controller";

const router = Router();

router.get('/objetivo/demanda-inducida', authenticate, authorizeRoles(['1']), getAllObjetiveDemandInduced);

router.post('/objetivo/demanda-inducida/buscar', authenticate, authorizeRoles(['1']), getObjetiveDemandInducedByName);

export default router;