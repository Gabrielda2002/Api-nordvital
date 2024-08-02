"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const manejar_errores_1 = require("./middlewares/manejar-errores");
const index_1 = __importDefault(require("./routes/index"));
const logger_middleware_1 = require("./middlewares/logger_middleware");
// * cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//* Middleware para loggear las peticiones
app.use(logger_middleware_1.loggerMiddleware);
// * variable global de prefijos para las rutas
const apiPrefix = process.env.API_PREFIX || '/api/v1';
// * Rutas
app.use(apiPrefix, index_1.default);
// Middleware para manejar errores
app.use(manejar_errores_1.errorHandler);
exports.default = app;
