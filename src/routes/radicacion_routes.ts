import { Router } from "express";
import { auditorRadicados, autorizarRadicado, cirugiasTable, createRadicado, deleteRadicado, getAllRadicacion, getRadicacionById, mostrarTabla, tablaPorAuditar, updateRadicado } from "../controllers/radicacion_controller";
import { validarId } from "../middlewares/validar-id";
import {upload} from "../middlewares/multer-config";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

router.get('/radicacion',authenticate, authorizeRoles(['1','10', '3', '15']), getAllRadicacion);

router.get('/radicacion/:id',authenticate, authorizeRoles(['1', '10', '3', '15']), validarId,  getRadicacionById);

router.post('/radicacion',authenticate, authorizeRoles(['1', '10', '3', '15']), createRadicado);

router.put('/radicacion/:id',authenticate, authorizeRoles(['1', '10', '3']), validarId, updateRadicado);

router.delete('/radicacion/:id',authenticate, authorizeRoles(['1']), validarId, deleteRadicado);

router.get('/radicacion-table',authenticate, authorizeRoles(['1', '10', '3', '15']),  mostrarTabla);

router.get('/auditoria-table', authenticate, authorizeRoles(['1','3']),  tablaPorAuditar);

router.get('/auditoria-auditados', authenticate, authorizeRoles(['1','3']),  auditorRadicados);

router.put('/autorizar-radicado/:id',authenticate, authorizeRoles(['1','3']), validarId, autorizarRadicado);

router.get('/tabla-cirugias',authenticate, authorizeRoles(['1', '10', '3', '15']),  cirugiasTable);


export default router;