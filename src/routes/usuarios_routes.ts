import { Router } from "express";
import { getAllUsuarios } from "../controllers/usuario_controller";

const router = Router();

router.get('/usuarios', getAllUsuarios);

export default router;