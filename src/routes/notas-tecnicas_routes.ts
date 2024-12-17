import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createNotaTecnica, deleteNotaTecnica, getAllNotaTecnica, getNotaTecnicaById, updateNotaTecnica } from "../controllers/notas-tecnicas_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/notas-tecnicas', authenticate, authorizeRoles(['1']), getAllNotaTecnica);

router.get('/notas-tecnicas/:id', authenticate, authorizeRoles(['1']),validarId ,getNotaTecnicaById);

router.post('/notas-tecnicas', authenticate, authorizeRoles(['1']), createNotaTecnica);

router.put('/notas-tecnicas/:id', authenticate, authorizeRoles(['1']),validarId ,updateNotaTecnica);

router.delete('/notas-tecnicas/:id', authenticate, authorizeRoles(['1']),validarId ,deleteNotaTecnica);

export default router;