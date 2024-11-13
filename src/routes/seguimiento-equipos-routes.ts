import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createFollowEquipment, deleteFollowEquipment, getAllFollowEquipment, getFollowEquipment, updateFollowEquipment } from "../controllers/seguimiento-equipos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/seguimiento-equipos", authenticate, authorizeRoles(['1']), getAllFollowEquipment);

router.get("/seguimiento-equipos/:id", authenticate, authorizeRoles(['1']),validarId, getFollowEquipment);

router.post("/seguimiento-equipos", authenticate, authorizeRoles(['1']), createFollowEquipment);

router.put("/seguimiento-equipos/:id", authenticate, authorizeRoles(['1']),validarId, updateFollowEquipment);

router.delete("/seguimiento-equipos/:id", authenticate, authorizeRoles(['1']),validarId, deleteFollowEquipment);

export default router;