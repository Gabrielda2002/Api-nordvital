import { Router } from "express";
import { createUnidadFuncional, deleteUnidadFuncional, getAllUnidadFuncional, getUnidadFuncionalById, updateUnidadFuncional } from "../controllers/unidad-funcional_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/unidad-funcional', getAllUnidadFuncional);

router.get('/unidad-funcional/:id',validarId ,getUnidadFuncionalById);

router.post('/unidad-funcional', createUnidadFuncional);

router.put('/unidad-funcional/:id',validarId ,updateUnidadFuncional);

router.delete('/unidad-funcional/:id',validarId ,deleteUnidadFuncional);

export default router;