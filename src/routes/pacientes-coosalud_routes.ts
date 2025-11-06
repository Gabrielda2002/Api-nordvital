import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { createPatientCoosalud, deletePatientCoosalud, getAllPatientsCoosalud, getPatientByIdentificationCoosalud, updatePatientCoosalud, updatePatientsStatusFromExcel, updatePatientsRegimenFromExcel } from "../controllers/pacientes-coosalud.controller";
import { validarId } from "../middlewares/validate-type-id.middleware";
import { uploadXlsx } from "../middlewares/upload-xlsx-PS";

const router = Router();

router.get('/pacientes-coosalud', authenticate, authorizeRoles([ '1']), getAllPatientsCoosalud)

router.get('/pacientes-coosalud/:id', authenticate, authorizeRoles([ '1']), validarId ,getPatientByIdentificationCoosalud)

router.post('/pacientes-coosalud', authenticate, authorizeRoles([ '1']), createPatientCoosalud)

router.put('/pacientes-coosalud/:id', authenticate, authorizeRoles([ '1']), validarId,updatePatientCoosalud)

router.delete('/pacientes-coosalud/:id', authenticate, authorizeRoles([ '1']),validarId ,deletePatientCoosalud)

router.post('/paciente-identificacion', authenticate, authorizeRoles(['1','2','3','4','5','6','10','11','12','13','14','15','16', '17', '18']), getPatientByIdentificationCoosalud)

router.put('/patients/status', authenticate, authorizeRoles(['1']), uploadXlsx, updatePatientsStatusFromExcel)

router.put('/patients/regimen', authenticate, authorizeRoles(['1']), uploadXlsx, updatePatientsRegimenFromExcel)

export default router