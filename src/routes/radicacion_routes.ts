import { Router } from "express";
import { createRadicado, getAllRadicacion, getRadicacionById } from "../controllers/radicacion_controller";
import { validarId } from "../middlewares/validar-id_middleware";


const router = Router();

router.get('/radicacion', getAllRadicacion);

router.get('/radicacion/:id', validarId,  getRadicacionById);

router.post('/radicacion', createRadicado);

export default router;