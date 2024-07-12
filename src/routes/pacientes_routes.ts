import { Router } from "express";
import { getAllPacientes } from "../controllers/pacientes_controller";

const router = Router();

router.get("/pacientes", getAllPacientes);

export default router;