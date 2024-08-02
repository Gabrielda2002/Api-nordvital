import { Router } from "express";
import { createIpsPrimaria, deleteIpsPrimaria, getAllIpsPrimaria, getIpsPrimaria, updateIpsPrimaria } from "../controllers/ips-primaria_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";


const router = Router();

router.get('/ips-primaria',authenticate, authorizeRoles(['1']), getAllIpsPrimaria);

router.get('/ips-primaria/:id',authenticate, authorizeRoles(['1']),validarId ,getIpsPrimaria);

router.post('/ips-primaria',authenticate, authorizeRoles(['1']),createIpsPrimaria);

router.put('/ips-primaria/:id',authenticate, authorizeRoles(['1']), validarId ,updateIpsPrimaria);

router.delete('/ips-primaria/:id',authenticate, authorizeRoles(['1']),validarId ,deleteIpsPrimaria);

export default router;