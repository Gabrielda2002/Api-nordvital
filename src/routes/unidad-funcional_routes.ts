import { Router } from "express";
import { createUnidadFuncional, deleteUnidadFuncional, getAllUnidadFuncional, getUnidadFuncionalById, updateUnidadFuncional } from "../controllers/unidad-funcional_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/unidad-funcional',authenticate, authorizeRoles(['1' , '2']), getAllUnidadFuncional);

router.get('/unidad-funcional/:id',authenticate, authorizeRoles(['1' , '2']),validarId ,getUnidadFuncionalById);

router.post('/unidad-funcional',authenticate, authorizeRoles(['1' , '2']), createUnidadFuncional);

router.put('/unidad-funcional/:id',authenticate, authorizeRoles(['1' , '2']),validarId ,updateUnidadFuncional);

router.delete('/unidad-funcional/:id',authenticate, authorizeRoles(['1']),validarId ,deleteUnidadFuncional);

export default router;