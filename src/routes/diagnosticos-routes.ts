import { Router } from "express";
import { createDiagnostico, deleteDiagnostico, getAllDiagnosticos, getDiagnosticoById, updateDiagnostico } from "../controllers/diagnostico-controller";
import { validarId } from "../middlewares/validar-id_middleware";

const router = Router();

router.get("/diagnosticos", getAllDiagnosticos);

router.get("/diagnosticos/:id", validarId, getDiagnosticoById);

router.post("/diagnosticos", createDiagnostico);

router.put("/diagnosticos/:id",validarId ,updateDiagnostico);

router.delete("/diagnosticos/:id", validarId, deleteDiagnostico);

export default router;