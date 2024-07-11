"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const conexion_1 = require("./db/conexion");
try {
    conexion_1.AppDataSource.initialize();
    const PUERTO = process.env.PORT || 3600;
    app_1.default.listen(PUERTO, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PUERTO}`);
    });
}
catch (error) {
    console.log(`Ha ocurrido un error al iniciar el servidor: ${error}`);
}
