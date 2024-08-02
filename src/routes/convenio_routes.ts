import { Router } from "express";
import { createConvenio, deleteConvenio, getAllConvenio, getConvenioById, updateConvenio } from "../controllers/convenio-controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";

const router = Router();

router.get('/convenio',authenticate, authorizeRoles(['1']), getAllConvenio);

router.get('/convenio/:id',authenticate, authorizeRoles(['1']), validarId, getConvenioById);

router.post('/convenio',authenticate, authorizeRoles(['1']),createConvenio)

router.put('/convenio/:id',authenticate, authorizeRoles(['1']), validarId,updateConvenio)

router.delete('/convenio/:id',authenticate, authorizeRoles(['1']), validarId, deleteConvenio)

export default router;