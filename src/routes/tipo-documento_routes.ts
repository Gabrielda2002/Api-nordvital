
import { Router  } from "express";
import { createDocumentType, deleteDocumentType, getAllDocumentType, getDocumentTypeById, updateDocumentType } from "../controllers/tipo-documento_controller";
import { validarId } from "../middlewares/validar-id";


const router = Router();

router.get('/documento', getAllDocumentType);

router.get('/documento/:id', validarId, getDocumentTypeById);

router.post('/documento', createDocumentType);

router.put('/documento/:id', validarId, updateDocumentType);

router.delete('/documento/:id', validarId, deleteDocumentType);

export default router;
