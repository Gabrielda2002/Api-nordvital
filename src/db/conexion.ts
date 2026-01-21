import { DataSource } from "typeorm";
import { config } from "../config/environment.config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  charset: "utf8mb4",
  synchronize: false,
  port: config.database.port,
  entities: [__dirname + "/../entities/*{.ts,.js}"],
  logging: true,
  // migrationsRun: true,
  migrations:  [__dirname + "/../migrations/*{.ts,.js}"],
  connectTimeout: config.database.connectionTimeout, // 20 segundos de tiempo de espera
  timezone: config.database.timezone, // Ajusta la zona horaria según sea necesario
});