import { Router } from "express";
import { createConvenio, deleteConvenio, getAllConvenio, getConvenioById, updateConvenio } from "../controllers/convenio-controller";

const router = Router();

router.get('/convenio', getAllConvenio);

router.get('/convenio/:id', getConvenioById);

router.post('/convenio', createConvenio)

router.put('/convenio/:id', updateConvenio)

router.delete('/convenio/:id', deleteConvenio)

export default router;