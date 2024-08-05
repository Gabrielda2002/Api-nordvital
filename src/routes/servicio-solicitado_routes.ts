import { Router } from "express";
import { createServicioSolicitado, deleteServicioSolicitado, getAllServiciosSolicitados, getServicioSolicitado, updateServicioSolicitado } from "../controllers/servio-solicitado_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/servicio-solicitado",authenticate, authorizeRoles(['1', '2', '5']), getAllServiciosSolicitados);

router.get("/servicio-solicitado/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,getServicioSolicitado);

router.post("/servicio-solicitado",authenticate, authorizeRoles(['1', '2', '5']), createServicioSolicitado);

router.put("/servicio-solicitado/:id",authenticate, authorizeRoles(['1', '2', '5']), validarId ,updateServicioSolicitado);

router.delete("/servicio-solicitado/:id",authenticate, authorizeRoles(['1']), validarId ,deleteServicioSolicitado);

export default router;