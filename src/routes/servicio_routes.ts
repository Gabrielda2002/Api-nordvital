import { Router } from "express";
import { createServicio, deleteServicio, getAllServicios, getServicioById, updateServicio } from "../controllers/servicio_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router(); 

router.get("/servicios",authenticate, authorizeRoles(['1']), getAllServicios)

router.get("/servicios/:id",authenticate, authorizeRoles(['1']), validarId ,getServicioById)

router.post("/servicios",authenticate, authorizeRoles(['1']), createServicio)

router.put("/servicios/:id",authenticate, authorizeRoles(['1']),validarId ,updateServicio)

router.delete("/servicios/:id",authenticate, authorizeRoles(['1']),validarId , deleteServicio)

export default router;