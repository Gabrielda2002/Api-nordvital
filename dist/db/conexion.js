"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "44.222.149.53",
    username: process.env.DB_USER || "nordvitalDb",
    password: process.env.DB_PASS || "nordvital-api-db",
    database: process.env.DB_NAME || "nordvitalips",
    charset: "utf8mb4",
    synchronize: false,
    port: parseInt(process.env.DB_PORT || "3306"),
    entities: [__dirname + "/../entities/*{.ts, .js}"],
    logging: true,
    // migrationsRun: true,
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    connectTimeout: 20000, // 20 segundos de tiempo de espera
});
