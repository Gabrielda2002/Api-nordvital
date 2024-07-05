import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import radicacionRoutes from './routes/radicacion_routes';
import tipoDocumentoRoutes from './routes/tipo-documento_routes';
import convenioRoutes from './routes/convenio_routes';
import ipsPrimariaRoutes from './routes/ips-primaria_routes';
import especialidadRoutes from './routes/especialidad_routes';
import ipsRemiteRoutes from './routes/ips-remite_routes';
import lugarRadicacionRoutes from './routes/lugar-radicacion_routes';


const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(radicacionRoutes);
app.use(tipoDocumentoRoutes);
app.use(convenioRoutes)
app.use(ipsPrimariaRoutes);
app.use(especialidadRoutes)
app.use(lugarRadicacionRoutes);
app.use(ipsRemiteRoutes)

export default app;