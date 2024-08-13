import { Router } from "express";
import { createRadicado, deleteRadicado, getAllRadicacion, getRadicacionById, mostrarTabla, updateRadicado } from "../controllers/radicacion_controller";
import { validarId } from "../middlewares/validar-id";
import {upload} from "../middlewares/multer-config";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

router.get('/radicacion',authenticate, authorizeRoles(['1', '2','3', '5']), getAllRadicacion);

router.get('/radicacion/:id',authenticate, authorizeRoles(['1', '2','3', '5']), validarId,  getRadicacionById);

router.post('/radicacion',authenticate, authorizeRoles(['1', '2','3', '5']), createRadicado);

router.put('/radicacion/:id',authenticate, authorizeRoles(['1', '2','3', '5']), validarId, updateRadicado);

router.delete('/radicacion/:id',authenticate, authorizeRoles(['1']), validarId, deleteRadicado);

router.get('/radicacion-tabla',authenticate, authorizeRoles(['1', '2','3', '5']),  mostrarTabla);



export default router;