import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { createPatientCoosalud, deletePatientCoosalud, getAllPatientsCoosalud, getPatientByIdentificationCoosalud, updatePatientCoosalud } from "../controllers/pacientes-coosalud_controller";
import { validarId } from "../middlewares/validar-id";

const router = Router();

router.get('/pacientes-coosalud', authenticate, authorizeRoles([ '1']), getAllPatientsCoosalud)

router.get('/pacientes-coosalud/:id', authenticate, authorizeRoles([ '1']), validarId ,getPatientByIdentificationCoosalud)

router.post('/pacientes-coosalud', authenticate, authorizeRoles([ '1']), createPatientCoosalud)

router.put('/pacientes-coosalud/:id', authenticate, authorizeRoles([ '1']), validarId,updatePatientCoosalud)

router.delete('/pacientes-coosalud/:id', authenticate, authorizeRoles([ '1']),validarId ,deletePatientCoosalud)

router.post('/paciente-identificacion', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16']), getPatientByIdentificationCoosalud)

export default router