"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const manejar_errores_1 = require("./middlewares/manejar-errores");
const index_routes_1 = __importDefault(require("./routes/index-routes"));
const logger_middleware_1 = require("./middlewares/logger_middleware");
const rate_limit_1 = require("./middlewares/rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
// * cargar variables de entorno
// dotenv.config();
const app = (0, express_1.default)();
app.get('/ping', (req, res) => {
    res.send('API funcionando correctamente');
});
app.set('trust proxy', 1);
app.use((0, cors_1.default)());
app.use(rate_limit_1.limiter);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// * Middleware para proteger la aplicación
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false, // Deshabilitar la política para recursos estáticos
}));
//* Middleware para loggear las peticiones
app.use(logger_middleware_1.loggerMiddleware);
app.use('/api/v1/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// * variable global de prefijos para las rutas
const apiPrefix = process.env.API_PREFIX || '/api/v1';
// * Rutas
app.use(apiPrefix, index_routes_1.default);
// Middleware para manejar errores
app.use(manejar_errores_1.errorHandler);
exports.default = app;
