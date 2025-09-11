import { Router } from "express";
import { createPosition, getAllPosition, getPositionByName, updatePosition } from "../controllers/cargo.controller";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

router.get("/cargo", authenticate, authorizeRoles(["1"]), getAllPosition);

router.post("/cargo/name", authenticate, authorizeRoles(["1"]), getPositionByName);

router.post("/cargo", authenticate, authorizeRoles(["1"]), createPosition);

router.put("/cargo/:id", authenticate, authorizeRoles(["1"]), updatePosition);

export default router;