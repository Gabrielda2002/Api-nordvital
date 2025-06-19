import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllResultCalls, getResultCallByName } from "../controllers/resultado-llamada.controller";

const router = Router();

router.get("/resultado/demanda-inducida", authenticate, authorizeRoles(['1']), getAllResultCalls);

router.post("/resultado/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getResultCallByName);

export default router;