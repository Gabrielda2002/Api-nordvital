import { Router } from "express";
import { createMonitoringDevicesNetwork, deleteMonitoringDevicesNetwork, getAllMonitoringDevicesNetwork, getMonitoringDevicesNetwork, updateMonitoringDevicesNetwork } from "../controllers/seguimiento-dispositivos-red_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/seguimiento-dispositivos-red", authenticate, authorizeRoles(['1']), getAllMonitoringDevicesNetwork);

router.get("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, getMonitoringDevicesNetwork);

router.post("/seguimiento-dispositivos-red", authenticate, authorizeRoles(['1']), createMonitoringDevicesNetwork);

router.put("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, updateMonitoringDevicesNetwork);

router.delete("/seguimiento-dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, deleteMonitoringDevicesNetwork);

export default router;