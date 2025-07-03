import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllPrograms, getProgramByName } from "../controllers/programa.controller";

const router = Router();

router.get("/programas", authenticate, authorizeRoles(['1']), getAllPrograms);

router.post("/programas/buscar", authenticate, authorizeRoles(['1']), getProgramByName);

export default router;