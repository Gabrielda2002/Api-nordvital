import { DataSource } from "typeorm";
import { Radicacion } from "../entities/radicacion";
import { TipoDocumento } from "../entities/tipo-documento";
import { Convenio } from "../entities/convenio";
import { IpsPrimaria } from "../entities/ips-primaria";
import { Especialidad } from "../entities/especialidad";
import { LugarRadicacion } from "../entities/lugar-radicacion";
import { IpsRemite } from "../entities/ips-remite";
import { GrupoServicios } from "../entities/grupo-servicios";
import { TipoServicios } from "../entities/tipo-servicios";
import { Radicador } from "../entities/radicador";
import { Estados } from "../entities/estados";
import { CupsRadicados } from "../entities/cups-radicados";
import { Diagnostico } from "../entities/diagnostico";
import { EstadosSeguimiento } from "../entities/estados-seguimiento";
import { Municipio } from "../entities/municipio";
import { Pacientes } from "../entities/pacientes";
import { Permisos } from "../entities/permisos";
import { Roles } from "../entities/roles";
import { SeguimietoAuxiliar } from "../entities/seguimiento-auxiliar";
import { Servicios } from "../entities/servicios";
import { ServiciosSolicitados } from "../entities/servicios-solicitados";
import { UnidadFuncional } from "../entities/unidad-funcional";
import { Usuarios } from "../entities/usuarios";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "nordvitalips-api-test",
  synchronize: false,
  port: 3306,
  entities: [
    Radicacion,
    TipoDocumento,
    Convenio,
    IpsPrimaria,
    Especialidad,
    LugarRadicacion,
    IpsRemite,
    GrupoServicios,
    TipoServicios, 
    Radicador,
    Estados,
    CupsRadicados,
    Diagnostico,
    EstadosSeguimiento,
    Municipio,
    Pacientes,
    Permisos,
    Roles, 
    SeguimietoAuxiliar,
    Servicios,
    ServiciosSolicitados,
    UnidadFuncional, 
    Usuarios
  ],
  logging: true,
  migrationsRun: true,
  migrations:  [__dirname + "/../migrations/*{.ts, .js}"],
});