import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createActiveBrake, deleteActiveBrake, getActiveBrakeById, getAllActiveBrakes, updateActiveBrake } from "../controllers/pausas-activas_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/active-brakes", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), getAllActiveBrakes)

router.get("/active-brakes/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), validarId, getActiveBrakeById)

router.post("/active-brakes", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), createActiveBrake) 

router.put("/active-brakes/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), validarId, updateActiveBrake)

router.delete("/active-brakes/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), validarId, deleteActiveBrake)

export default router;