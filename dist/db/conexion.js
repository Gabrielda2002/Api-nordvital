"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: "utf8mb4",
    synchronize: false,
    port: parseInt("3306"),
    entities: [__dirname + "/../entities/*{.ts,.js}"],
    logging: true,
    // migrationsRun: true,
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    connectTimeout: 20000, // 20 segundos de tiempo de espera
});
