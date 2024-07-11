import { Router } from "express";
import { getAllDiagnosticos } from "../controllers/diagnostico-controller";

const router = Router();

router.get("/diagnosticos", getAllDiagnosticos);

export default router;