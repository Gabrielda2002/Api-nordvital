import { Router } from "express";
import { createServicioSolicitado, deleteServicioSolicitado, getAllServiciosSolicitados, getServicioSolicitado, updateServicioSolicitado } from "../controllers/servio-solicitado_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get("/servicio-solicitado", getAllServiciosSolicitados);

router.get("/servicio-solicitado/:id", validarId ,getServicioSolicitado);

router.post("/servicio-solicitado", createServicioSolicitado);

router.put("/servicio-solicitado/:id", validarId ,updateServicioSolicitado);

router.delete("/servicio-solicitado/:id", validarId ,deleteServicioSolicitado);

export default router;