import { Router } from "express";
import { createIpsPrimaria, deleteIpsPrimaria, getAllIpsPrimaria, getIpsPrimaria, updateIpsPrimaria } from "../controllers/ips-primaria_controller";


const router = Router();

router.get('/ips-primaria', getAllIpsPrimaria);

router.get('/ips-primaria/:id', getIpsPrimaria);

router.post('/ips-primaria', createIpsPrimaria);

router.put('/ips-primaria/:id', updateIpsPrimaria);

router.delete('/ips-primaria/:id', deleteIpsPrimaria);

export default router;