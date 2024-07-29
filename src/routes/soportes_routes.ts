import { Router } from "express";
import { createSoporte, deleteSoporte, getAllSorportes, getSoporteById, updateSoporte } from "../controllers/soportes_controladores";
import { validarId } from "../middlewares/validar-id";
import { upload } from "../middlewares/multer-config";

const router = Router();

router.get("/soportes", getAllSorportes);

router.get("/soportes/:id", validarId , getSoporteById);

router.post("/soportes", upload.single('file') , createSoporte);

router.put("/soportes/:id",upload.single('file') ,validarId, updateSoporte);

router.delete("/soportes/:id", validarId, deleteSoporte);

export default router;