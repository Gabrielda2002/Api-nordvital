import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import radicacionRoutes from './routes/radicacion_routes';
import tipoDocumentoRoutes from './routes/tipo-documento_routes';
import convenioRoutes from './routes/convenio_routes';
import ipsPrimariaRoutes from './routes/ips-primaria_routes';
import especialidadRoutes from './routes/especialidad_routes';
import ipsRemiteRoutes from './routes/ips-remite_routes';
import lugarRadicacionRoutes from './routes/lugar-radicacion_routes';
import grupoServiciosRoutes from './routes/grupo-servicios_routes';
import radicadorRoutes from './routes/radicador_routes';
import estadosRoutes from './routes/estados_routes';
import cupsRadicadosRoutes from './routes/cups-radicados_routes';
import diagnosticosRoutes from './routes/diagnosticos-routes';
import estadoSeguimientoRoutes from './routes/estados-seguimientos_routes';
import municipioRoutes from './routes/municipio_routes';
import pacientesRoutes from './routes/pacientes_routes';
import permisosRoutes from './routes/permisos_routes';
import rolesRoutes from './routes/roles_routes';
import seguimientoAuxiliarRoutes from './routes/seguimiento-auxiliar_routes';
import serviciosRoutes from './routes/servicio_routes';
import servicioSolicitadoRoutes from './routes/servicio-solicitado_routes';
import unidadFuncionalRoutes from './routes/unidad-funcional_routes';
import usuariosRoutes from './routes/usuarios_routes';
import permisosRolRoutes from './routes/permisos-rol_routes';
import permisosUsuarioRoutes from './routes/permisos-usuario_routes';
import { errorHandler } from './middlewares/manejar-errores_middleware';
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// * variable global de prefijos para las rutas
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// * Rutas

app.use(radicacionRoutes);
app.use(tipoDocumentoRoutes);
app.use(convenioRoutes)
app.use(ipsPrimariaRoutes);
app.use(especialidadRoutes)
app.use(lugarRadicacionRoutes);
app.use(ipsRemiteRoutes);
app.use(grupoServiciosRoutes);
app.use(radicadorRoutes);
app.use(estadosRoutes);
app.use(cupsRadicadosRoutes);
app.use(diagnosticosRoutes)
app.use(estadoSeguimientoRoutes);
app.use(municipioRoutes);
app.use(pacientesRoutes);
app.use(permisosRoutes);
app.use(rolesRoutes);
app.use(seguimientoAuxiliarRoutes);
app.use(serviciosRoutes);
app.use(servicioSolicitadoRoutes);
app.use(unidadFuncionalRoutes);
app.use(usuariosRoutes);
app.use(permisosRolRoutes);
app.use(permisosUsuarioRoutes);


// Middleware para manejar errores
app.use(errorHandler);


export default app;