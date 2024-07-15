import { Router } from "express";
import { getAllUnidadFuncional } from "../controllers/unidad-funcional_controller";

const router = Router();

router.get('/unidad-funcional', getAllUnidadFuncional);

export default router;