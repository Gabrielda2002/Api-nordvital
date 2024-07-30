import { Router } from "express";
import { createServicio, deleteServicio, getAllServicios, getServicioById, updateServicio } from "../controllers/servicio_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router(); 

router.get("/servicios", getAllServicios)

router.get("/servicios/:id", validarId ,getServicioById)

router.post("/servicios", createServicio)

router.put("/servicios/:id",validarId ,updateServicio)

router.delete("/servicios/:id",validarId , deleteServicio)

export default router;