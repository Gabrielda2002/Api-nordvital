import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createDevice, deleteDevice, getAllDevices, getDevice, getDevicesBySede, updateDevice } from "../controllers/dispositivos-red_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/dispositivos-red", authenticate, authorizeRoles(['1']), getAllDevices);

router.get("/dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, getDevice);

router.post("/dispositivos-red", authenticate, authorizeRoles(['1']), createDevice);

router.put("/dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, updateDevice);

router.delete("/dispositivos-red/:id", authenticate, authorizeRoles(['1']),validarId, deleteDevice);

router.get("/dispositivos-red-sede/:id", authenticate, authorizeRoles(['1']),validarId, getDevicesBySede);

export default router;