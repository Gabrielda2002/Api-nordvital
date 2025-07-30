import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createGoal, deleteGoal, getGoalsByPrograms } from "../controllers/programa-meta-historico.controller";

const router = Router();


router.get("/metas/programas", authenticate, authorizeRoles(["1",  '19', '20', '21']), getGoalsByPrograms);

router.post("/metas/programas", authenticate, authorizeRoles(["1", '20', '21']), createGoal);

router.delete("/metas/programas/:id", authenticate, authorizeRoles(["1", '20']), deleteGoal);

export default router;