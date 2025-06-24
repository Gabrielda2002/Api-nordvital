import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllReasonVisit } from "../controllers/motivo-visita.controller";
import { getRelationUserByName } from "../controllers/relacion-usuario.controller";

const router = Router();

router.get("/motivo-visita/demanda-inducida", authenticate, authorizeRoles(['1']), getAllReasonVisit);

router.post("/motivo-visita/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getRelationUserByName);

export default router;