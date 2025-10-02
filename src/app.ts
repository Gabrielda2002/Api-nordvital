import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middlewares/manejar-errores";
import routes from "./routes/index.routes";
import { loggerMiddleware } from "./middlewares/logger_middleware";
import { limiter } from "./middlewares/rate-limit";
import helmet from "helmet";
import path from "path";
import { errorLoggerMiddleware } from "./middlewares/error-logger-middleware";
import { sanitizeBody } from "./middlewares/sanitize-body";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swagger-options";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

// * cargar variables de entorno
dotenv.config();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3600",
  "https://test.nordvitalips.com",
  "https://nordvitalips.com",
  "https://www.nordvitalips.com",
  "https://nordvitalips.com",
  "https://www.app.nordvitalips.com",
  "https://app.nordvitalips.com",
  "http://localhost:4321"
];

export let  io: SocketIOServer;

const server = http.createServer(app);
io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins, 
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
  },
})



io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id)

  // unirse a una sala especifica
  socket.on('join', (room) => {
    socket.join(room)
    console.log(`Se unicio el usuario ${socket.id} a la sala ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('Usuario desconectado', socket.id)
  })
})

app.use(
  cors({
    exposedHeaders: ["token-status", "Content-Disposition"],
    origin: function (origin, callback) {
      // * permitir la solicitud si esta ene el array
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Content-Disposition"],
    credentials: true,
  })
);

app.use(limiter);
app.use(morgan("dev"));

app.use(cookieParser());


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// * Middleware para sanitizar (trim) los strings del body
app.use(sanitizeBody);

// * Middleware para proteger la aplicación
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Deshabilitar la política para recursos estáticos
  })
);

//* Middleware para loggear las peticiones
app.use(loggerMiddleware);

// * variable global de prefijos para las rutas
const apiPrefix = process.env.API_PREFIX || "/api/v1";

// * Rutas

const spects = swaggerJsDoc(options)

app.use(apiPrefix, routes);

// * Swagger UI - Solo disponible en desarrollo y testing
if (process.env.NODE_ENV !== 'production') {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spects));
  console.log('📚 Swagger UI disponible en: /api-docs');
} else {
  console.log('🔒 Swagger UI deshabilitado en producción');
}

// * middleware para manejar los errores en los logs
app.use(errorLoggerMiddleware);
// * Middleware para manejar errores
app.use(errorHandler);


export default server;
