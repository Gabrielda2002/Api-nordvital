import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { getAllRelationUser, getRelationUserByName } from "../controllers/relacion-usuario.controller";

const router = Router();

router.get("/relacion/demanda-inducida", authenticate, authorizeRoles(['1']), getAllRelationUser);

router.post("/relacion/demanda-inducida/buscar", authenticate, authorizeRoles(['1']), getRelationUserByName);

export default router;