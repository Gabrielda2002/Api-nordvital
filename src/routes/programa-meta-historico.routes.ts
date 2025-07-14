import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createGoal, getGoalsByPrograms } from "../controllers/programa-meta-historico.controller";

const router = Router();


router.get("/metas/programas", authenticate, authorizeRoles(["1"]), getGoalsByPrograms);

router.post("/metas/programas", authenticate, authorizeRoles(["1"]), createGoal);

export default router;