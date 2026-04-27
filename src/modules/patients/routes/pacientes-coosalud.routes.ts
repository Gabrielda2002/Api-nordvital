import { Router } from "express";
import { authenticate } from "@core/middlewares/authenticate.middleware";
import { authorizeRoles } from "@core/middlewares/authorize-roles.middleware";
import { createPatientCoosalud, deletePatientCoosalud, getAllPatientsCoosalud, getPatientByIdentificationCoosalud, updatePatientCoosalud, updatePatientsStatusFromExcel, updatePatientsRegimenFromExcel } from "../controllers/pacientes-coosalud.controller";
import { validarId } from "@core/middlewares/validate-type-id.middleware";
import { uploadXlsx } from "@core/middlewares/upload-xlsx-PS";
import { ROLE_IDS } from "@core/constants/roles";

const router = Router();

router.get('/pacientes-coosalud', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), getAllPatientsCoosalud)

router.get('/pacientes-coosalud/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId ,getPatientByIdentificationCoosalud)

router.post('/pacientes-coosalud', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), createPatientCoosalud)

router.put('/pacientes-coosalud/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), validarId,updatePatientCoosalud)

router.delete('/pacientes-coosalud/:id', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]),validarId ,deletePatientCoosalud)

router.post('/paciente-identificacion', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR, ROLE_IDS.GERENTE, ROLE_IDS.AUDITOR, ROLE_IDS.CALIDAD, ROLE_IDS.AUXILIAR, ROLE_IDS.COORDINADOR, ROLE_IDS.RADICADOR, ROLE_IDS.SIAU, ROLE_IDS.CONTRATACION, ROLE_IDS.MEDICO, ROLE_IDS.JEFE, ROLE_IDS.CIRUGIA, ROLE_IDS.PARAMEDICO, ROLE_IDS.SOPORTE, ROLE_IDS.RRHH]), getPatientByIdentificationCoosalud)

router.put('/patients/status', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), uploadXlsx, updatePatientsStatusFromExcel)

router.put('/patients/regimen', authenticate, authorizeRoles([ROLE_IDS.ADMINISTRADOR]), uploadXlsx, updatePatientsRegimenFromExcel)

export default router
