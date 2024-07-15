import { Router } from "express";
import { getAllServiciosSolicitados } from "../controllers/servio-solicitado_controller";

const router = Router();

router.get("/servicio-solicitado", getAllServiciosSolicitados);

export default router;