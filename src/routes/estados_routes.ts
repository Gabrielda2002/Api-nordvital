import { Router } from "express";
import { getAllEstados } from "../controllers/estados_controller";

const router = Router();

router.get("/estados", getAllEstados);

export default router;