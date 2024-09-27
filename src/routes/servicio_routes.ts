import { Router } from "express";
import { createServicio, deleteServicio, getAllServicios, getServicioById, getServiciosByName, updateServicio, updateStatusServicio } from "../controllers/servicio_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router(); 

router.get("/servicios",authenticate, authorizeRoles(['1', '2']), getAllServicios)

router.get("/servicios/:id",authenticate, authorizeRoles(['1', '2']), validarId ,getServicioById)

router.post("/servicios",authenticate, authorizeRoles(['1', '2']), createServicio)

router.put("/servicios/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateServicio)

router.delete("/servicios/:id",authenticate, authorizeRoles(['1']),validarId , deleteServicio)

router.post("/servicios-name",authenticate, authorizeRoles(['1', '2']), getServiciosByName)

router.put("/update-status-servicio/:id",validarId ,authenticate, authorizeRoles(['1', '2']), updateStatusServicio);

export default router;