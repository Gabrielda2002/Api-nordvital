import { Router } from "express";
import { getAllRoles } from "../controllers/roles_controller";

const router = Router();

router.get("/roles", getAllRoles);

export default router;