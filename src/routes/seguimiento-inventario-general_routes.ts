import { Router } from "express";
import { createInventoryTrackingGeneral, getAllInventoryTrackingGeneralByItem } from "../controllers/seguimiento-inventario-general_controller";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/seguimuento/inventario-general/:id', authenticate, authorizeRoles(['1']), getAllInventoryTrackingGeneralByItem);

router.post('/seguimiento/inventario-general', authenticate, authorizeRoles(['1']), createInventoryTrackingGeneral);

export default router;