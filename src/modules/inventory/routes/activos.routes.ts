import { Router } from "express";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { ROLE_IDS, ROLE_GROUPS } from "@core/constants/roles";
import { getAllByAssetId } from "../controllers/activos.controller";

const router = Router();

router.get('/activos/:id', authenticate, authorizeRoles(ROLE_GROUPS.COORDINADORES),validarId ,getAllByAssetId);

export default router;