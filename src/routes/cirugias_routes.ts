import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createSurgery, deleteSurgery, getAllSurgery, getSurgery, updateSurgery } from "../controllers/cirugias_controller";
import { validarId } from "../middlewares/validar-id";


const router = Router();

router.get('/cirugias', authenticate, authorizeRoles(['1', '15']), getAllSurgery);

router.get('/cirugias/:id', authenticate, authorizeRoles(['1', '15']), validarId, getSurgery);

router.post('/cirugias', authenticate, authorizeRoles(['1', '15']), createSurgery);

router.put('/cirugias/:id', authenticate, authorizeRoles(['1', '15']), validarId, updateSurgery);

router.delete('/cirugias/:id', authenticate, authorizeRoles(['1']), validarId, deleteSurgery);

export default router;