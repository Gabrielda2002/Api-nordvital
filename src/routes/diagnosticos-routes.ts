import { Router } from "express";
import { createDiagnostico, deleteDiagnostico, getAllDiagnosticos, getDiagnosticoById, updateDiagnostico } from "../controllers/diagnostico-controller";

const router = Router();

router.get("/diagnosticos", getAllDiagnosticos);

router.get("/diagnosticos/:id", getDiagnosticoById);

router.post("/diagnosticos", createDiagnostico);

router.put("/diagnosticos/:id", updateDiagnostico);

router.delete("/diagnosticos/:id", deleteDiagnostico);

export default router;