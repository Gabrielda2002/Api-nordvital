import { DataSource } from "typeorm";
import { config } from "@core/config/environment.config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  charset: "utf8mb4",
  synchronize: false,
  port: config.database.port,
  // Support both legacy flat structure and new modular structure during migration
  entities: [
    __dirname + "/../../entities/*{.ts,.js}",
    __dirname + "/../../modules/**/entities/*{.ts,.js}"
  ],
  logging: true,
  migrations:  [__dirname + "/../../migrations/*{.ts,.js}"],
  connectTimeout: config.database.connectionTimeout, // 20 segundos de tiempo de espera
  timezone: config.database.timezone, // Ajusta la zona horaria según sea necesario
});