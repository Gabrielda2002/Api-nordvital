import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createServicioGeneral, deleteServicioGeneral, getServicioGeneral, getServicioGeneralById, updateServicioGeneral } from "../controllers/servicios-generales_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/servicios-generales', authenticate, authorizeRoles(['1']), getServicioGeneral);

router.get('/servicios-generales/:id', authenticate, authorizeRoles(['1']), validarId, getServicioGeneralById);

router.post('/servicios-generales', authenticate, authorizeRoles(['1']), createServicioGeneral);

router.put('/servicios-generales/:id', authenticate, authorizeRoles(['1']), validarId, updateServicioGeneral);

router.delete('/servicios-generales/:id', authenticate, authorizeRoles(['1']), validarId, deleteServicioGeneral);

export default router;