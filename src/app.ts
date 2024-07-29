import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/manejar-errores';
import routes from './routes/index';

// * cargar variables de entorno
dotenv.config();


const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// * variable global de prefijos para las rutas
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// * Rutas

app.use(apiPrefix, routes);


// Middleware para manejar errores
app.use(errorHandler);


export default app;