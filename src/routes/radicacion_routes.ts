import { Router } from "express";
import { createRadicado, getAllRadicacion, getRadicacionById } from "../controllers/radicacion_controller";


const router = Router();

router.get('/radicacion', getAllRadicacion);

router.get('/radicacion/:id', getRadicacionById);

router.post('/radicacion', createRadicado);

export default router;