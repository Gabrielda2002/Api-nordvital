import { Router } from "express";
import { createCupsRadicados, deleteCupsRadicados, getAllCupsRadicados, getCupsRadicados, updateCupsRadicados } from "../controllers/cups-radicados_controller";

const router = Router();

router.get("/cups-radicados", getAllCupsRadicados);

router.get("/cups-radicados/:id", getCupsRadicados);

router.post("/cups-radicados", createCupsRadicados)

router.put("/cups-radicados/:id", updateCupsRadicados);

router.delete("/cups-radicados/:id", deleteCupsRadicados);

export default router;