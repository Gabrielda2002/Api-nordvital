import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middlewares/manejar-errores";
import routes from "./routes/index-routes";
import { loggerMiddleware } from "./middlewares/logger_middleware";
import { limiter } from "./middlewares/rate-limit";
import helmet from "helmet";
import path from "path";
import { errorLoggerMiddleware } from "./middlewares/error-logger-middleware";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swagger-options";

// * cargar variables de entorno
dotenv.config();

const app = express();

app.get("/ping", (req, res) => {
  res.send("API funcionando correctamente");
});

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  "https://test.nordvitalips.com",
  "https://nordvitalips.com",
  "https://www.nordvitalips.com",
  "https://nordvitalips.com",
  "https://www.app.nordvitalips.com",
  "https://app.nordvitalips.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // * permitir la solicitud si esta ene el array
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(limiter);
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// * Middleware para proteger la aplicación
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Deshabilitar la política para recursos estáticos
  })
);

//* Middleware para loggear las peticiones
app.use(loggerMiddleware);

app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

// * variable global de prefijos para las rutas
const apiPrefix = process.env.API_PREFIX || "/api/v1";

// * Rutas

const spects = swaggerJsDoc(options)

app.use(apiPrefix, routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spects));

// Middleware para manejar errores
app.use(errorHandler);

// * middleware para manejar los errores en los logs
app.use(errorLoggerMiddleware);

export default app;
