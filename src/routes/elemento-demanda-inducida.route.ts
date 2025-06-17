import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllElementDemandInduced, getElementDemandInducedByName } from "../controllers/elemento-demanda-inducida.controller";

const router = Router();

router.get("/elementos/demanda-inducida", authenticate, authorizeRoles(['1']), getAllElementDemandInduced);

router.post("/elementos/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getElementDemandInducedByName);

export default router;