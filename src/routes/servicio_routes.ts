import { Router } from "express";
import { getAllServicios } from "../controllers/servicio_controller";

const router = Router(); 

router.get("/servicios", getAllServicios)

export default router;