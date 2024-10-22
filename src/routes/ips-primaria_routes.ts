import { Router } from "express";
import { createIpsPrimaria, deleteIpsPrimaria, getAllIpsPrimaria, getIpsPrimaria, getIpsPrimariaByName, updateIpsPrimaria, updateStatusIpsPrimaria } from "../controllers/ips-primaria_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

router.get('/ips-primaria',authenticate, authorizeRoles(['1', '3', '10', '15']), getAllIpsPrimaria);

router.get('/ips-primaria/:id',authenticate, authorizeRoles(['1', '2']),validarId ,getIpsPrimaria);

router.post('/ips-primaria',authenticate, authorizeRoles(['1', '2']),createIpsPrimaria);

router.put('/ips-primaria/:id',authenticate, authorizeRoles(['1', '2']), validarId ,updateIpsPrimaria);

router.delete('/ips-primaria/:id',authenticate, authorizeRoles(['1']),validarId ,deleteIpsPrimaria);

router.post('/ips-primaria-name',authenticate, authorizeRoles(['1', '2']), getIpsPrimariaByName);

router.put('/update-status-ips-primaria/:id',authenticate, authorizeRoles(['1', '2']), validarId, updateStatusIpsPrimaria);

export default router;