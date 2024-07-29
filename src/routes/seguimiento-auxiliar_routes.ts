import { Router } from "express";
import { createSeguimientoAuxiliar, deleteSeguimientoAuxiliar, getAllSeguimientosAuxiliares, getSeguimientoAuxiliar, updateSeguimientoAuxiliar } from "../controllers/seguimiento-auxiliar_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/seguimientos-auxiliares", getAllSeguimientosAuxiliares);

router.get("/seguimientos-auxiliares/:id", validarId ,getSeguimientoAuxiliar);

router.post("/seguimientos-auxiliares", createSeguimientoAuxiliar);

router.put("/seguimientos-auxiliares/:id", validarId ,updateSeguimientoAuxiliar);

router.delete("/seguimientos-auxiliares/:id", validarId ,deleteSeguimientoAuxiliar);

export default router;