import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { uploadSggc } from "../middlewares/multer-config-ssgc";
import { createFile, deleteFile, downloadFile, getAllFiles, getFileById, updateFile } from "../controllers/archivo_controller";
import { validarId } from "../middlewares/validar-id";
import { parseParentFolderId } from "../middlewares/parse-parent-folder-id";



const router = Router();

router.get("/archivo", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']) , getAllFiles);

router.get("/archivo/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']),validarId  ,getFileById);

router.post("/archivo", authenticate, authorizeRoles(['1','4']),uploadSggc, parseParentFolderId, createFile);

router.put("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId, updateFile);

router.delete("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId, deleteFile);

router.get("/download-file/:id", authenticate, authorizeRoles(['1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16']),validarId, downloadFile);

export default router;