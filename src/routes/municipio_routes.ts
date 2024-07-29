import { Router } from "express";
import { createMunicipio, deleteMunicipio, getAllMunicipios, getMunicipioById, updateMunicipio } from "../controllers/municipio_controller";
import { validarId } from "../middlewares/validar-id";
import { Municipio } from "../entities/municipio";

const router = Router();

router.get('/municipios', getAllMunicipios);

router.get('/municipios/:id', validarId, getMunicipioById);

router.post('/municipios', createMunicipio);

router.put('/municipios/:id', validarId ,updateMunicipio);

router.delete('/municipios/:id', validarId, deleteMunicipio);

export default router;