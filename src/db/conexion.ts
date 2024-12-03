import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "nordvitalips-api-test",
  charset: "utf8mb4",
  synchronize: false,
  port: parseInt("3306"),
  entities: [__dirname + "/../entities/*{.ts,.js}"],
  logging: true,
  // migrationsRun: true,
  migrations:  [__dirname + "/../migrations/*{.ts,.js}"],
  connectTimeout: 20000, // 20 segundos de tiempo de espera
});