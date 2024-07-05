import { DataSource } from "typeorm";
import { Radicacion } from "../entities/radicacion";
import { TipoDocumento } from "../entities/tipo-documento";
import { Convenio } from "../entities/convenio";
import { IpsPrimaria } from "../entities/ips-primaria";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "nordvitalips",
    synchronize: false,
    port: 3306,
    entities : [Radicacion, TipoDocumento, Convenio, IpsPrimaria],
    logging: true,
});