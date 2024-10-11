import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";
import { createFolder, deleteFolder, getAllFolders, getFolderById, getSgcFoldersFiles, updateFolder } from "../controllers/carpeta_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/carpetas',authenticate , authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), getAllFolders);

router.get('/carpetas/:id',authenticate , authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16' ]), validarId, getFolderById);

router.post('/carpetas', authenticate, authorizeRoles(['1', '4' ]), createFolder);

router.put('/carpetas/:id',authenticate , authorizeRoles(['1', '4' ]), validarId, updateFolder);

router.delete('/carpetas/:id',authenticate , authorizeRoles(['1']), validarId, deleteFolder);

router.get('/sistema-calidad/:id?' , authenticate , authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']), getSgcFoldersFiles);

export default router;