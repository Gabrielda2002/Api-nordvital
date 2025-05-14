import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPhone, getCountPhonesByHeadquartersId, getPhoneAgeByHeadquartersId, getPhoneBySedeId, getPhoneWarrantyStatistics, updatePhone } from "../controllers/celular_controller";
import { uploadDocDelivery } from "../middlewares/upload-doc-delivery_middleware";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/inventario/celulares-sede/:id', authenticate, authorizeRoles(['1']), getPhoneBySedeId);

router.post('/celular', authenticate, authorizeRoles(['1']), uploadDocDelivery, createPhone);

router.put('/celular/:id', authenticate, authorizeRoles(['1']), validarId, uploadDocDelivery, updatePhone);

router.get('/celular/statics/headquarters', authenticate, authorizeRoles(['1']), getCountPhonesByHeadquartersId);

router.get('/celular/statics/age', authenticate, authorizeRoles(['1']), getPhoneAgeByHeadquartersId)

router.get('/celular/statics/warrantyExpiration', authenticate, authorizeRoles(['1']), getPhoneWarrantyStatistics);

export default router;