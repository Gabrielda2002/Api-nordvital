import { Router } from "express";
import { createSeguimientoAuxiliar, deleteSeguimientoAuxiliar, getAllSeguimientosAuxiliares, getSeguimientoAuxiliar, updateSeguimientoAuxiliar } from "../controllers/seguimiento-auxiliar_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/seguimientos-auxiliares",authenticate, authorizeRoles(['1', '2', '5']), getAllSeguimientosAuxiliares);

router.get("/seguimientos-auxiliares/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,getSeguimientoAuxiliar);

router.post("/seguimientos-auxiliares",authenticate, authorizeRoles(['1', '2', '10', '6']), createSeguimientoAuxiliar);

router.put("/seguimientos-auxiliares/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,updateSeguimientoAuxiliar);

router.delete("/seguimientos-auxiliares/:id",authenticate, authorizeRoles(['1']), validarId ,deleteSeguimientoAuxiliar);

export default router;