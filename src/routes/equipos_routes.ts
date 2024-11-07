import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createEquipment, deleteEquipment, getAllEquipments, getEquipmentBySede, updateEquipment } from "../controllers/equipos_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/equipos", authenticate, authorizeRoles(['1']) ,getAllEquipments);

router.get("/equipos/:id", authenticate, authorizeRoles(['1']), validarId ,getAllEquipments);

router.post("/equipos", authenticate, authorizeRoles(['1']), createEquipment);

router.put("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, updateEquipment);

router.delete("/equipos/:id", authenticate, authorizeRoles(['1']), validarId, deleteEquipment);

router.get("/equipos-sede/:id", authenticate, authorizeRoles(['1']), validarId, getEquipmentBySede);

export default router;