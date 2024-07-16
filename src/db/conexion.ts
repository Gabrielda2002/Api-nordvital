import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "nordvitalips-api-test",
  synchronize: false,
  port: parseInt(process.env.DB_PORT || "3306"),
  entities: [__dirname + "/../entities/*{.ts, .js}"],
  logging: true,
  migrationsRun: true,
  migrations:  [__dirname + "/../migrations/*{.ts, .js}"],
});