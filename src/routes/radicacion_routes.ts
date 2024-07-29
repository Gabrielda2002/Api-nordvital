import { Router } from "express";
import { createRadicado, deleteRadicado, getAllRadicacion, getRadicacionById, updateRadicado } from "../controllers/radicacion_controller";
import { validarId } from "../middlewares/validar-id";
import {upload} from "../middlewares/multer-config";


const router = Router();

router.get('/radicacion', getAllRadicacion);

router.get('/radicacion/:id', validarId,  getRadicacionById);

router.post('/radicacion', createRadicado);

router.put('/radicacion/:id', validarId, updateRadicado);

router.delete('/radicacion/:id', validarId, deleteRadicado);



export default router;