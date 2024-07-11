import { Router } from "express";
import { getAllCupsRadicados } from "../controllers/cups-radicados_controller";

const router = Router();

router.get("/cups-radicados", getAllCupsRadicados);

export default router;