import { Router } from "express";
import { createMunicipio, deleteMunicipio, getAllMunicipios, getMunicipioById, updateMunicipio } from "../controllers/municipio_controller";
import { validarId } from "../middlewares/validar-id";
import { Municipio } from "../entities/municipio";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/municipios',authenticate, authorizeRoles(['1', '2']), getAllMunicipios);

router.get('/municipios/:id',authenticate, authorizeRoles(['1', '2']), validarId, getMunicipioById);

router.post('/municipios',authenticate, authorizeRoles(['1', '2']), createMunicipio);

router.put('/municipios/:id',authenticate, authorizeRoles(['1', '2']), validarId ,updateMunicipio);

router.delete('/municipios/:id',authenticate, authorizeRoles(['1']), validarId, deleteMunicipio);

export default router;