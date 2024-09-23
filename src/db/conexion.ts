import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "nordvita_Developers",
password: process.env.DB_PASS || "NaRDViToL1.0.5.58",
  database: process.env.DB_NAME || "nordvita_nordvitalips-api-test",
  charset: "utf8mb4",
  synchronize: false,
  port: parseInt(process.env.DB_PORT || "3306"),
  entities: [__dirname + "/../entities/*{.ts, .js}"],
  logging: true,
  // migrationsRun: true,
  migrations:  [__dirname + "/../migrations/*{.ts, .js}"],
});