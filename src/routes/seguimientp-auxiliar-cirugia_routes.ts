import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createAuxiliarySurgery, deleteAuxiliarySurgery, getAllAuxiliarySurgeries, getAuxiliarySurgery, updateAuxiliarySurgery } from "../controllers/seguimiento-auxiliar-cirugias_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/seguimiento-auxiliar-cirugia', authenticate, authorizeRoles(['1', '2']), getAllAuxiliarySurgeries);

router.get('/seguimiento-auxiliar-cirugia/:id', authenticate, authorizeRoles(['1', '2']), validarId, getAuxiliarySurgery);

router.post('/seguimiento-auxiliar-cirugia', authenticate, authorizeRoles(['1', '15']), createAuxiliarySurgery);

router.put('/seguimiento-auxiliar-cirugia/:id', authenticate, authorizeRoles(['1', '2']), validarId, updateAuxiliarySurgery);

router.delete('/seguimiento-auxiliar-cirugia/:id', authenticate, authorizeRoles(['1', '2']), validarId, deleteAuxiliarySurgery);

export default router;