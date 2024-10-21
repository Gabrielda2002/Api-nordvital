import { Router } from "express";
import { autorizarCups, createCupsRadicados, deleteCupsRadicados, getAllCupsRadicados, getCupsRadicados, updateAuditados, updateCupsRadicados } from "../controllers/cups-radicados_controller";
import { validarId } from "../middlewares/validar-id";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/cups-radicados",authenticate, authorizeRoles(['1', '2', '3' , '5']), getAllCupsRadicados);

router.get("/cups-radicados/:id",authenticate, authorizeRoles(['1', '2', '3' , '5']), validarId, getCupsRadicados);

router.post("/cups-radicados",authenticate, authorizeRoles(['1','3','10','15']), createCupsRadicados)

router.put("/cups-radicados/:id",authenticate, authorizeRoles(['1', '2', '3' , '5']), validarId,updateCupsRadicados);

router.delete("/cups-radicados/:id",authenticate, authorizeRoles(['1']), validarId,deleteCupsRadicados);

router.put("/autorizar-cups/:id", authenticate, authorizeRoles(['1', '2', '3']), validarId,   autorizarCups);

router.put("/actualizar-cups/:id", authenticate, authorizeRoles(['1', '2', '3']), validarId,   updateAuditados);

export default router;