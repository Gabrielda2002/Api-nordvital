
import { Router  } from "express";
import { createDocumentType, deleteDocumentType, getAllDocumentType, getDocumentTypeById, updateDocumentType, updateStatusDocumentType } from "../controllers/tipo-documento_controller";
import { validarId } from "../middlewares/validar-id";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";


const router = Router();

router.get('/documento',authenticate, authorizeRoles(['1' , '3', '10', '15']), getAllDocumentType);

router.get('/documento/:id',authenticate, authorizeRoles(['1' , '2']), validarId, getDocumentTypeById);

router.post('/documento',authenticate, authorizeRoles(['1' , '2']), createDocumentType);

router.put('/documento/:id',authenticate, authorizeRoles(['1' , '2']), validarId, updateDocumentType);

router.delete('/documento/:id',authenticate, authorizeRoles(['1']), validarId, deleteDocumentType);

router.put("/update-status-documento/:id",authenticate, authorizeRoles(['1']), validarId, updateStatusDocumentType);

export default router;
