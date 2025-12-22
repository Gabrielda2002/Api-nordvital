import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler.middleware";
import routes from "./routes/index.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { limiter } from "./middlewares/rate-limit.middleware";
import helmet from "helmet";
import path from "path";
import { errorLoggerMiddleware } from "./middlewares/error-logger.middleware";
import { sanitizeBody } from "./middlewares/sanitize-body.middleware";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swagger-options";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import { config } from "./config/environment.config";
import Logger from "./utils/logger-wrapper";

// * cargar variables de entorno
dotenv.config();

const app = express();

app.set("trust proxy", 1);

export let  io: SocketIOServer;

const server = http.createServer(app);
io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.allowedOrigins, 
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
  },
})



io.on('connection', (socket) => {
  Logger.info(`Usuario conectado: ${socket.id}`);

  // unirse a una sala especifica
  socket.on('join', (room) => {
    socket.join(room)
    Logger.info(`Usuario ${socket.id} se unió a la sala: ${room}`);
  })

  socket.on('disconnect', () => {
    Logger.info(`Usuario desconectado: ${socket.id}`);
  })
})

app.use(
  cors({
    exposedHeaders: ["token-status", "Content-Disposition"],
    origin: function (origin, callback) {
      // * permitir la solicitud si esta ene el array
      if (!origin || config.cors.allowedOrigins.indexOf(origin) !== -1) {
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

// * Rutas

const spects = swaggerJsDoc(options)

app.use(config.server.apiPrefix, routes);

// * Swagger UI - Solo disponible en desarrollo y testing
if (!config.server.isProduction) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spects));
  Logger.info('📚 Swagger UI disponible en: /api-docs');
} else {
  Logger.info('🔒 Swagger UI deshabilitado en producción');
}

// * middleware para manejar los errores en los logs
app.use(errorLoggerMiddleware);
// * Middleware para manejar errores
app.use(errorHandler);


export default server;
