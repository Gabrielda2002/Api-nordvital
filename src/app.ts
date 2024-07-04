import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import radicacionRoutes from './routes/radicacion_routes';
import tipoDocumentoRoutes from './routes/tipo-documento_routes';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(radicacionRoutes);
app.use(tipoDocumentoRoutes);

export default app;