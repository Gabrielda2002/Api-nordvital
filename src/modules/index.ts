import { Router } from "express";

// Import all module routes
import { authRoutes, usuariosRoutes, rolesRoutes } from "./auth";
import { moodleRoutes } from "./moodle";
import { emailRoutes } from "./email";
import { eventosRoutes, participantesRoutes } from "./events";
import { carpetasRoutes, archivosRoutes } from "./documents";
import { notificacionesRoutes, pushSubscriptionRoutes } from "./notifications";
import { programsRoutes, goalsRoutes } from "./programs";
import { cirugiasRoutes, seguimientoAuxiliarCirugiasRoutes } from "./surgeries";
import { pacientesRoutes, pacientesCoosaludRoutes, diagnosticosRoutes } from "./patients";
import {
  ticketsRoutes,
  ticketAttachmentsRoutes,
  estadosTicketsRoutes,
  prioridadRoutes,
  categoriasRoutes,
  comentariosRoutes,
} from "./tickets";
import {
  permissionRequestRoutes,
  vacationRoutes,
  pausasActivasRoutes,
  certificadosRoutes,
  cargoRoutes,
  cvPublicRoutes,
  encuestasSatisfaccionRoutes,
  registroEntradaRoutes,
} from "./hr";
import {
  demandaInducidaRoutes,
  elementoDemandaInducidaRoutes,
  tipoDemandaInducidaRoutes,
  objetivoDemandaInducidaRoutes,
  areaPersonaSeguimientoRoutes,
  motivoVisitaRoutes,
  resultadoLlamadaRoutes,
  resumenSeguimientoActividadRoutes,
} from "./demand-induced";
import {
  tipoDocumentoRoutes,
  convenioRoutes,
  ipsPrimariaRoutes,
  ipsRemiteRoutes,
  especialidadRoutes,
  sedesRoutes,
  grupoServiciosRoutes,
  municipioRoutes,
  departamentosRoutes,
  unidadFuncionalRoutes,
  tipoAreaRoutes,
  areaDependenciaRoutes,
  areaEpsRoutes,
  areaRoutes,
  servicioRoutes,
  servicioSolicitadoRoutes,
  profesionalesRoutes,
  relacionUsuarioRoutes,
} from "./catalog";
import {
  radicacionRoutes,
  cupsRadicadosRoutes,
  soportesRoutes,
  estadosRoutes,
  estadosSeguimientoRoutes,
  seguimientoAuxiliarRoutes,
  notasTecnicasRoutes,
  cartaRecobroRoutes,
  serviciosEjecutadosRoutes,
  serviciosGeneralesRoutes,
  reportExcelRoutes,
} from "./radicacion";
import {
  equiposRoutes,
  accesoriosEquiposRoutes,
  componentesRoutes,
  softwareRoutes,
  dispositivosRedRoutes,
  celularRoutes,
  televisorRoutes,
  inventarioGeneralRoutes,
  seguimientoEquiposRoutes,
  seguimientoDispositivosRedRoutes,
  seguimientoCelularesRoutes,
  seguimientoTelevisoresRoutes,
  seguimientoInventarioGeneralRoutes,
  maintenanceChecklistRoutes,
  activosRoutes,
  tipoActivoRoutes,
  clasificacionRoutes,
  materialesRoutes,
  estadoIvGeneralRoutes,
} from "./inventory";

const router = Router();

// Auth module
router.use(authRoutes);
router.use(usuariosRoutes);
router.use(rolesRoutes);

// Moodle module
router.use(moodleRoutes);

// Email module
router.use(emailRoutes);

// Events module
router.use(eventosRoutes);
router.use(participantesRoutes);

// Documents module
router.use(carpetasRoutes);
router.use(archivosRoutes);

// Notifications module
router.use(notificacionesRoutes);
router.use(pushSubscriptionRoutes);

// Programs module
router.use(programsRoutes);
router.use(goalsRoutes);

// Surgeries module
router.use(cirugiasRoutes);
router.use(seguimientoAuxiliarCirugiasRoutes);

// Patients module
router.use(pacientesRoutes);
router.use(pacientesCoosaludRoutes);
router.use(diagnosticosRoutes);

// Tickets module
router.use(ticketsRoutes);
router.use(ticketAttachmentsRoutes);
router.use(estadosTicketsRoutes);
router.use(prioridadRoutes);
router.use(categoriasRoutes);
router.use(comentariosRoutes);

// HR module
router.use(permissionRequestRoutes);
router.use(vacationRoutes);
router.use(pausasActivasRoutes);
router.use(certificadosRoutes);
router.use(cargoRoutes);
router.use(cvPublicRoutes); // Public routes - NO auth required
router.use(encuestasSatisfaccionRoutes);
router.use(registroEntradaRoutes);

// Demand-induced module
router.use(demandaInducidaRoutes);
router.use(elementoDemandaInducidaRoutes);
router.use(tipoDemandaInducidaRoutes);
router.use(objetivoDemandaInducidaRoutes);
router.use(areaPersonaSeguimientoRoutes);
router.use(motivoVisitaRoutes);
router.use(resultadoLlamadaRoutes);
router.use(resumenSeguimientoActividadRoutes);

// Catalog module
router.use(tipoDocumentoRoutes);
router.use(convenioRoutes);
router.use(ipsPrimariaRoutes);
router.use(ipsRemiteRoutes);
router.use(especialidadRoutes);
router.use("/group-services", grupoServiciosRoutes);
router.use(sedesRoutes);
router.use(municipioRoutes);
router.use(departamentosRoutes);
router.use(unidadFuncionalRoutes);
router.use(tipoAreaRoutes);
router.use(areaDependenciaRoutes);
router.use(areaEpsRoutes);
router.use(areaRoutes);
router.use(servicioRoutes);
router.use(servicioSolicitadoRoutes);
router.use(profesionalesRoutes);
router.use(relacionUsuarioRoutes);

// Radicacion module
router.use("/radicaciones", radicacionRoutes);
router.use(cupsRadicadosRoutes);
router.use(soportesRoutes);
router.use(estadosRoutes);
router.use(estadosSeguimientoRoutes);
router.use(seguimientoAuxiliarRoutes);
router.use(notasTecnicasRoutes);
router.use(cartaRecobroRoutes);
router.use(serviciosEjecutadosRoutes);
router.use(serviciosGeneralesRoutes);
router.use(reportExcelRoutes);

// Inventory module
router.use("/equipments", equiposRoutes);
router.use(accesoriosEquiposRoutes);
router.use(componentesRoutes);
router.use(softwareRoutes);
router.use("/devices-red", dispositivosRedRoutes);
router.use("/phones/inventory", celularRoutes);
router.use("/tv/inventory", televisorRoutes);
router.use("/general/inventory", inventarioGeneralRoutes);
router.use(seguimientoEquiposRoutes);
router.use(seguimientoDispositivosRedRoutes);
router.use(seguimientoCelularesRoutes);
router.use(seguimientoTelevisoresRoutes);
router.use(seguimientoInventarioGeneralRoutes);
router.use(maintenanceChecklistRoutes);
router.use(activosRoutes);
router.use(tipoActivoRoutes);
router.use(clasificacionRoutes);
router.use(materialesRoutes);
router.use(estadoIvGeneralRoutes);

export default router;
