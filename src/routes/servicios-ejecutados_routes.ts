import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createServiciosEjecutados, deleteServiciosEjecutados, getAllServiciosEjecutados, updateServiciosEjecutados } from "../controllers/servicios-ejecutados_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/servicios-ejecutados', authenticate , authorizeRoles(['1']), getAllServiciosEjecutados);

router.get('/servicios-ejecutados/:id', authenticate , authorizeRoles(['1']), validarId, getAllServiciosEjecutados);

router.post('/servicios-ejecutados', authenticate , authorizeRoles(['1']), createServiciosEjecutados);

router.put('/servicios-ejecutados/:id', authenticate , authorizeRoles(['1']), validarId, updateServiciosEjecutados);

router.delete('/servicios-ejecutados/:id', authenticate , authorizeRoles(['1']), validarId, deleteServiciosEjecutados);

export default router;