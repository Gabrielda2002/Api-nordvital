import { Router } from "express";
import { getAllRadicador } from "../controllers/radicador_controller";


const router = Router();

router.get("/radicador", getAllRadicador);

export default router;