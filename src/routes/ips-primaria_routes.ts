import { Router } from "express";
import { getAllIpsPrimaria } from "../controllers/ips-primaria_controller";


const router = Router();

router.get('/ips-primaria', getAllIpsPrimaria);

export default router;