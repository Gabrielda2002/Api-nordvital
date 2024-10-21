import { Router } from "express";
import { createSoporte, deleteSoporte, getAllSorportes, getSoporteById, updateSoporte } from "../controllers/soportes_controladores";
import { validarId } from "../middlewares/validar-id";
import { upload } from "../middlewares/multer-config";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/soportes",authenticate, authorizeRoles(['1', '2','3', '5']), getAllSorportes);

router.get("/soportes/:id",authenticate, authorizeRoles(['1', '2','3', '5']), validarId , getSoporteById);

router.post("/soportes",authenticate, authorizeRoles(['1', '3','10', '15']), upload.single('file') , createSoporte);

router.put("/soportes/:id",authenticate, authorizeRoles(['1', '2','3']),upload.single('file') ,validarId, updateSoporte);

router.delete("/soportes/:id",authenticate, authorizeRoles(['1']), validarId, deleteSoporte);

export default router;