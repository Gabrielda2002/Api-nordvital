import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPhone, getPhoneBySedeId, updatePhone } from "../controllers/celular_controller";
import { uploadDocDelivery } from "../middlewares/upload-doc-delivery_middleware";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/inventario/celulares-sede/:id', authenticate, authorizeRoles(['1']), getPhoneBySedeId);

router.post('/celular', authenticate, authorizeRoles(['1']),uploadDocDelivery.single('file'), createPhone);

router.put('/celular/:id', authenticate, authorizeRoles(['1']),uploadDocDelivery.single('file'), validarId, updatePhone);

export default router;