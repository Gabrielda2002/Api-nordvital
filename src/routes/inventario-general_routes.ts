import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createInventoryGeneral, getAllInventarioGeneral, getAllInventoryGeneralByHeadquarters, getInventoryGeneralAgeStatistics, getInventoryGeneralByHeadquartersStatistics, getInvetoryGeneralWarrantyStatitics, updateInventoryGeneral } from "../controllers/inventario-general_controller";

const router = Router();

router.get('/inventario/general', authenticate, authorizeRoles(['1']), getAllInventarioGeneral);

router.get('/inventario/general-sede/:id', authenticate, authorizeRoles(['1']), getAllInventoryGeneralByHeadquarters);

router.post('/inventario/general', authenticate, authorizeRoles(['1']), createInventoryGeneral);

router.put('/inventario/general/:id', authenticate, authorizeRoles(['1']), updateInventoryGeneral);

router.get('/inventario/general/statistics/warrantyExpiration', authenticate, authorizeRoles(['1']), getInvetoryGeneralWarrantyStatitics);

router.get('/inventario/general/statistics/age', authenticate, authorizeRoles(['1']), getInventoryGeneralAgeStatistics);

router.get('/inventario/general/statistics/headquarters', authenticate, authorizeRoles(['1']), getInventoryGeneralByHeadquartersStatistics);

export default router;