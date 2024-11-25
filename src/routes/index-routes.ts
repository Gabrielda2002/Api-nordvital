import { Router } from "express";

import radicacionRoutes from './radicacion_routes';
import tipoDocumentoRoutes from './tipo-documento_routes';
import convenioRoutes from './convenio_routes';
import ipsPrimariaRoutes from './ips-primaria_routes';
import especialidadRoutes from './especialidad_routes';
import ipsRemiteRoutes from './ips-remite_routes';
import lugarRadicacionRoutes from './lugar-radicacion_routes';
import grupoServiciosRoutes from './grupo-servicios_routes';
import radicadorRoutes from './radicador_routes';
import estadosRoutes from './estados_routes';
import cupsRadicadosRoutes from './cups-radicados_routes';
import diagnosticosRoutes from './diagnosticos-routes';
import estadoSeguimientoRoutes from './estados-seguimientos_routes';
import municipioRoutes from './municipio_routes';
import pacientesRoutes from './pacientes_routes';
import rolesRoutes from './roles_routes';
import seguimientoAuxiliarRoutes from './seguimiento-auxiliar_routes';
import serviciosRoutes from './servicio_routes';
import servicioSolicitadoRoutes from './servicio-solicitado_routes';
import unidadFuncionalRoutes from './unidad-funcional_routes';
import usuariosRoutes from './usuarios_routes';
import soportesRoutes from './soportes_routes';
import authRoutes from './auth_routes';
import carpetasRoutes from './carpetas_routes';
import archivosRoutes from './archivos_routes';
import cirugiasRoutes from './cirugias_routes';
import seguimientoAuxiliarCirugiasRoutes from './seguimientp-auxiliar-cirugia_routes';
import reportExcelRoutes from './report-excel_routes';
import certificateRoutes from './certificados_routes';
import accesoriosRoutes from './accesorios-equipos-routes';
import equiposRoutes from './equipos_routes';
import dispositivoRedRoutes from './dispositivos-red_routes';
import seguimientoEquipos from './seguimiento-equipos-routes';
import departamentoRoutes from './departamentos_routes';
import seguimientoDispositivosRed from './seguimiento-dispositivos-red_routes';
import componenteRoutes from './componentes_routes';
import softwareRoutes from './software_routes';

const router = Router();

// * Rutas
router.use( radicacionRoutes);
router.use( tipoDocumentoRoutes);
router.use( convenioRoutes);
router.use( ipsPrimariaRoutes);
router.use( especialidadRoutes);
router.use( lugarRadicacionRoutes);
router.use( ipsRemiteRoutes);
router.use( grupoServiciosRoutes);
router.use( radicadorRoutes);
router.use( estadosRoutes);
router.use( cupsRadicadosRoutes);
router.use( diagnosticosRoutes);
router.use( estadoSeguimientoRoutes);
router.use( municipioRoutes);
router.use( pacientesRoutes);
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
router.use(accesoriosRoutes);
router.use(equiposRoutes);
router.use(dispositivoRedRoutes);
router.use(seguimientoEquipos);
router.use(departamentoRoutes);
router.use(seguimientoDispositivosRed);
router.use(componenteRoutes);
router.use(softwareRoutes);

export default router;