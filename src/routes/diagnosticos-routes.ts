import { Router } from "express";
import { createDiagnostico, deleteDiagnostico, getAllDiagnosticos, getDiagnosticoById, getDiagnosticosByName, updateDiagnostico } from "../controllers/diagnostico-controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/diagnosticos",authenticate, authorizeRoles(['1', '2']), getAllDiagnosticos);

router.get("/diagnosticos/:id",authenticate, authorizeRoles(['1', '2']), validarId, getDiagnosticoById);

router.post("/diagnosticos",authenticate, authorizeRoles(['1', '2']), createDiagnostico);

router.put("/diagnosticos/:id",authenticate, authorizeRoles(['1', '2']),validarId ,updateDiagnostico);

router.delete("/diagnosticos/:id",authenticate, authorizeRoles(['1']), validarId, deleteDiagnostico);

router.post("/diagnosticos-name",authenticate, authorizeRoles(['1', '15']), getDiagnosticosByName);

export default router;