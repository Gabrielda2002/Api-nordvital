import { Router } from "express";
import { createRadicado, getAllRadicacion, getRadicacionById } from "../controllers/radicacion_controller";
import { validarId } from "../middlewares/validar-id";
import {upload} from "../middlewares/multer-config";


const router = Router();

router.get('/radicacion', getAllRadicacion);

router.get('/radicacion/:id', validarId,  getRadicacionById);

router.post('/radicacion', upload.single('archive') , createRadicado);

export default router;