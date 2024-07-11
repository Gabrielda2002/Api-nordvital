"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const radicacion_1 = require("../entities/radicacion");
const tipo_documento_1 = require("../entities/tipo-documento");
const convenio_1 = require("../entities/convenio");
const ips_primaria_1 = require("../entities/ips-primaria");
const especialidad_1 = require("../entities/especialidad");
const lugar_radicacion_1 = require("../entities/lugar-radicacion");
const ips_remite_1 = require("../entities/ips-remite");
const grupo_servicios_1 = require("../entities/grupo-servicios");
const tipo_servicios_1 = require("../entities/tipo-servicios");
const radicador_1 = require("../entities/radicador");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "nordvitalips-api-test-3",
    synchronize: false,
    port: 3306,
    entities: [
        radicacion_1.Radicacion,
        tipo_documento_1.TipoDocumento,
        convenio_1.Convenio,
        ips_primaria_1.IpsPrimaria,
        especialidad_1.Especialidad,
        lugar_radicacion_1.LugarRadicacion,
        ips_remite_1.IpsRemite,
        grupo_servicios_1.GrupoServicios,
        tipo_servicios_1.TipoServicios,
        radicador_1.Radicador
    ],
    logging: true,
    migrationsRun: true,
    migrations: ["../migrations/*.ts"],
});
