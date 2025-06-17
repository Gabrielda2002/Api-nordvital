import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllSummaryActivity, getSummaryActivityByName } from "../controllers/resumen-seguimiento-actividad.controller";

const router = Router();

router.get("/resumen/demanda-inducida", authenticate, authorizeRoles(['1']), getAllSummaryActivity);

router.post("/resumen/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getSummaryActivityByName);

export default router;