import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createDemandInduced, getAllDemandInduded } from "../controllers/demanda-inducida.controller";

const router = Router();

router.get("/demanda/inducida", authenticate, authorizeRoles(['1']), getAllDemandInduded);

router.post("/demanda/inducida", authenticate, authorizeRoles(['1']), createDemandInduced);

export default router;