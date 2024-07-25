import { Router } from "express";
import { createConvenio, deleteConvenio, getAllConvenio, getConvenioById, updateConvenio } from "../controllers/convenio-controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get('/convenio', getAllConvenio);

router.get('/convenio/:id', validarId, getConvenioById);

router.post('/convenio',createConvenio)

router.put('/convenio/:id', validarId,updateConvenio)

router.delete('/convenio/:id', validarId, deleteConvenio)

export default router;