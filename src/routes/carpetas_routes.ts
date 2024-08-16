import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createFolder, deleteFolder, getAllFolders, getFolderById, updateFolder } from "../controllers/carpeta_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/carpetas',authenticate , authorizeRoles(['1', '2']), getAllFolders);

router.get('/carpetas/:id',authenticate , authorizeRoles(['1', '2']), validarId, getFolderById);

router.post('/carpetas', authenticate, authorizeRoles(['1', '2']), createFolder);

router.put('/carpetas/:id',authenticate , authorizeRoles(['1', '2']), validarId, updateFolder);

router.delete('/carpetas/:id',authenticate , authorizeRoles(['1', '2']), validarId, deleteFolder);

export default router;