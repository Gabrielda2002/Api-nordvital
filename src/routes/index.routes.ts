import { Router } from "express";

import { 
  radicacionRoutes,
  estadosRoutes,
  cupsRadicadosRoutes,
  estadosSeguimientoRoutes as estadoSeguimientoRoutes,
  seguimientoAuxiliarRoutes,
  soportesRoutes,
  serviciosEjecutadosRoutes,
  serviciosGeneralesRoutes,
  notasTecnicasRoutes as notaTencicaRoutes,
  cartaRecobroRoutes,
  reportExcelRoutes
} from '../modules/radicacion';
import { 
  tipoDocumentoRoutes, 
  convenioRoutes, 
  ipsPrimariaRoutes, 
  especialidadRoutes, 
  ipsRemiteRoutes, 
  sedesRoutes as lugarRadicacionRoutes, 
  grupoServiciosRoutes, 
  municipioRoutes, 
  servicioRoutes as serviciosRoutes, 
  servicioSolicitadoRoutes, 
  unidadFuncionalRoutes,
  departamentosRoutes as departamentoRoutes,
  tipoAreaRoutes,
  areaDependenciaRoutes,
  relacionUsuarioRoutes as relationUserRoutes, 
  areaEpsRoutes, 
  profesionalesRoutes as professionalRoutes,
  areaRoutes
} from '../modules/catalog';
import { authRoutes, usuariosRoutes, rolesRoutes } from '../modules/auth';
import { carpetasRoutes, archivosRoutes } from '../modules/documents';
import { cirugiasRoutes, seguimientoAuxiliarCirugiasRoutes } from '../modules/surgeries';
import { pacientesRoutes, pacientesCoosaludRoutes, diagnosticosRoutes } from '../modules/patients';
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
  estadoIvGeneralRoutes
} from '../modules/inventory';
import certificateRoutes from '../modules/hr/routes/certificados.routes';
import activeBrakesRoutes from '../modules/hr/routes/pausas-activas.routes';
import eventosRoutes from '../modules/events/routes/eventos.routes';
import emailRoutes from '../modules/email/routes/send-emails.routes';
import cvPublicRoutes from '../modules/hr/routes/cv-public.routes';
import { ticketsRoutes, ticketAttachmentsRoutes, estadosTicketsRoutes, prioridadRoutes, categoriasRoutes, comentariosRoutes } from '../modules/tickets';
import encuestasSatisfaccionRoutes from '../modules/hr/routes/encuestas-satisfaccion.routes';
import { notificacionesRoutes, pushSubscriptionRoutes } from '../modules/notifications';
import registerEntries from '../modules/hr/routes/registro-entrada.routes';
import { programsRoutes, goalsRoutes } from '../modules/programs';
import { 
  demandaInducidaRoutes, 
  elementoDemandaInducidaRoutes, 
  tipoDemandaInducidaRoutes, 
  objetivoDemandaInducidaRoutes, 
  areaPersonaSeguimientoRoutes, 
  motivoVisitaRoutes, 
  resultadoLlamadaRoutes, 
  resumenSeguimientoActividadRoutes 
} from '../modules/demand-induced';
import cargoRoutes from '../modules/hr/routes/cargo.routes';
import permisosRoutes from '../modules/hr/routes/permission-request.routes';
import vacationsRoutes from '../modules/hr/routes/vacation.routes';
import participantesRoutes from '../modules/events/routes/participantes.routes';
import moodleRoutes from '../modules/moodle/routes/moodle.routes';

const router = Router();

// * Rutas
router.use('/radicaciones', radicacionRoutes);
router.use( tipoDocumentoRoutes);
router.use( convenioRoutes);
router.use( ipsPrimariaRoutes);
router.use( especialidadRoutes);
router.use( lugarRadicacionRoutes);
router.use( ipsRemiteRoutes);
router.use('/group-services', grupoServiciosRoutes);
router.use( estadosRoutes);
router.use( cupsRadicadosRoutes);
router.use( diagnosticosRoutes);
router.use( estadoSeguimientoRoutes);
router.use( municipioRoutes);
router.use( pacientesRoutes);
router.use( pacientesCoosaludRoutes);
router.use( rolesRoutes);
router.use( seguimientoAuxiliarRoutes);
router.use( serviciosRoutes);
router.use( servicioSolicitadoRoutes);
router.use( unidadFuncionalRoutes);
router.use( usuariosRoutes);
router.use( soportesRoutes);
router.use( authRoutes);
router.use(carpetasRoutes);
router.use(archivosRoutes);
router.use(cirugiasRoutes);
router.use(seguimientoAuxiliarCirugiasRoutes);
router.use(reportExcelRoutes);
router.use(certificateRoutes);
router.use(accesoriosEquiposRoutes);
router.use('/equipments', equiposRoutes);
router.use('/devices-red', dispositivosRedRoutes);
router.use(seguimientoEquiposRoutes);
router.use(maintenanceChecklistRoutes);
router.use(departamentoRoutes);
router.use(seguimientoDispositivosRedRoutes);
router.use(componentesRoutes);
router.use(softwareRoutes);
router.use(activeBrakesRoutes);
router.use(eventosRoutes);
router.use(serviciosEjecutadosRoutes);
router.use(serviciosGeneralesRoutes);
router.use(notaTencicaRoutes);
router.use(cartaRecobroRoutes); 
router.use(emailRoutes);
router.use(cvPublicRoutes); // Rutas públicas para CVs - NO requieren autenticación
router.use(ticketsRoutes);
router.use(ticketAttachmentsRoutes);
router.use(estadosTicketsRoutes);
router.use(prioridadRoutes);
router.use(categoriasRoutes);
router.use(comentariosRoutes);
router.use(encuestasSatisfaccionRoutes);
router.use(notificacionesRoutes);
router.use(pushSubscriptionRoutes);
router.use(registerEntries);
router.use('/general/inventory', inventarioGeneralRoutes);
router.use(clasificacionRoutes);
router.use(activosRoutes);
router.use(materialesRoutes);
router.use(estadoIvGeneralRoutes);
router.use(tipoAreaRoutes);
router.use(tipoActivoRoutes);
router.use(areaDependenciaRoutes);
router.use(seguimientoInventarioGeneralRoutes);
router.use(participantesRoutes);
router.use('/phones/inventory', celularRoutes);
router.use('/tv/inventory', televisorRoutes);
router.use(seguimientoTelevisoresRoutes);
router.use(seguimientoCelularesRoutes);
router.use(elementoDemandaInducidaRoutes);
router.use(tipoDemandaInducidaRoutes);
router.use(objetivoDemandaInducidaRoutes);
router.use(relationUserRoutes);
router.use(areaEpsRoutes);
router.use(resumenSeguimientoActividadRoutes);
router.use(resultadoLlamadaRoutes);
router.use(areaPersonaSeguimientoRoutes);
router.use(motivoVisitaRoutes);
router.use(professionalRoutes);
router.use(programsRoutes);
router.use(demandaInducidaRoutes);
router.use(goalsRoutes);
router.use(areaRoutes);
router.use(cargoRoutes);
router.use(permisosRoutes);
router.use(vacationsRoutes);
router.use(moodleRoutes);

export default router;