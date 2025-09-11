import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createArea, getAllAreas, getAreaByName, updateArea } from "../controllers/area.controller";

const router = Router();

router.get("/area", authenticate, authorizeRoles(["1"]), getAllAreas);

router.post("/area/name", authenticate, authorizeRoles(["1"]), getAreaByName);

router.post("/area", authenticate, authorizeRoles(["1"]), createArea);

router.put("/area/:id", authenticate, authorizeRoles(["1"]), updateArea);

export default router;