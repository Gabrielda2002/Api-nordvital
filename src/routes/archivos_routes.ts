import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { uploadSggc } from "../middlewares/multer-config-ssgc";
import { createFile, deleteFile, getAllFiles, getFileById, updateFile } from "../controllers/archivo_controller";
import { validarId } from "../middlewares/validar-id";


const router = Router();

router.get("/archivo", authenticate, authorizeRoles(['1','4']) , getAllFiles)

router.get("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId  ,getFileById)

router.post("/archivo", authenticate, authorizeRoles(['1','4']), uploadSggc, createFile)

router.put("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId, updateFile)

router.delete("/archivo/:id", authenticate, authorizeRoles(['1','4']),validarId, deleteFile)

export default router;