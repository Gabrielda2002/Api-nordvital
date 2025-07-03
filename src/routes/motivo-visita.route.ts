import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllReasonVisit, getReasonVisitByName } from "../controllers/motivo-visita.controller";

const router = Router();

router.get("/motivo-visita/demanda-inducida", authenticate, authorizeRoles(['1']), getAllReasonVisit);

router.post("/motivo-visita/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getReasonVisitByName);

export default router;