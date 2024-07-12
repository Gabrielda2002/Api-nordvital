import { Router } from "express";
import { getAllMunicipios } from "../controllers/municipio_controller";

const router = Router();

router.get('/municipios', getAllMunicipios);

export default router;