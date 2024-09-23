"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "NaRDViToL1.0.5.58p",
    database: process.env.DB_NAME || "nordvita_nordvitalips-api-test",
    charset: "utf8mb4",
    synchronize: false,
    port: parseInt(process.env.DB_PORT || "3306"),
    entities: [__dirname + "/../entities/*{.ts, .js}"],
    logging: true,
    // migrationsRun: true,
    migrations: [__dirname + "/../migrations/*{.ts, .js}"],
});
