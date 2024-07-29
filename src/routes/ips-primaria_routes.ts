import { Router } from "express";
import { createIpsPrimaria, deleteIpsPrimaria, getAllIpsPrimaria, getIpsPrimaria, updateIpsPrimaria } from "../controllers/ips-primaria_controller";
import { validarId } from "../middlewares/validar-id";


const router = Router();

router.get('/ips-primaria', getAllIpsPrimaria);

router.get('/ips-primaria/:id',validarId ,getIpsPrimaria);

router.post('/ips-primaria',createIpsPrimaria);

router.put('/ips-primaria/:id', validarId ,updateIpsPrimaria);

router.delete('/ips-primaria/:id',validarId ,deleteIpsPrimaria);

export default router;