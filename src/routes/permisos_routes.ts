import { Router } from "express";
import { getAllPermisos } from "../controllers/permisos_controller";

const router = Router();

router.get("/permisos", getAllPermisos);

export default router;