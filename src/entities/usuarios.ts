import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Municipio } from "./municipio";
import { Roles } from "./roles";
import { TipoDocumento } from "./tipo-documento";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from "class-validator";
import { Carpeta } from "./carpeta";
import { Radicacion } from "./radicacion";
import { seguimientoEquipos } from "./seguimiento-equipos";
import { SeguimientoDispositivosRed } from "./seguimiento-dispositivos-red";
import { Equipos } from "./equipos";
import { SeguimietoAuxiliar } from "./seguimiento-auxiliar";
import { LugarRadicacion } from "./lugar-radicacion";
import { PausasActivas } from "./pausas-activas";
import { CartaRecobro } from "./Carta_recobro";
import { Tickets } from "./tickets";
import { Notification } from "./notificaciones";
import { PushSubscription } from "./push-subscription";
import { EncuestasSatisfaccion } from "./encuestas-satisfaccion";
import { RegistroEntrada } from "./registro-entrada";
import { SeguimientoAuxiliarCirugias } from "./seguimiento-auxiliar-cirugias";
import { SeguimientoInventarioGeneral } from "./seguimiento-inventario-general";
import { Televisor } from "./televisor";
import { Celular } from "./celular";
import { SeguimientoTelevisor } from "./seguimiento-televisor";
import { SeguimientoCelular } from "./seguimiento-celular";
import { Comentarios } from "./comentarios";
import { RefreshToken } from "./refresh-tokens";
import { DemandaInducida } from "./demanda-inducida";
import { Area } from "./area";
import { Cargo } from "./cargo";

@Entity({ name: "usuario" })
export class Usuarios extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "cedula" })
  @IsInt()
  @IsNotEmpty({ message: "El número de cédula es requerido" })
  dniNumber: number;

  @Column({ name: "nombre" })
  @IsString()
  @IsNotEmpty({ message: "El nombre del usuario es requerido" })
  @Length(2, 150, {
    message: "El nombre del usuario debe tener entre 3 y 50 caracteres",
  })
  name: string;

  @Column({ name: "apellido" })
  @IsString()
  @IsNotEmpty({ message: "El apellido del usuario es requerido" })
  @Length(2, 150, {
    message: "El apellido del usuario debe tener entre 3 y 50 caracteres",
  })
  lastName: string;

  @Column({ name: "tipo_cedula_id" })
  @IsInt()
  @IsNotEmpty({ message: "El tipo de cédula es requerido" })
  dniType: number;

  @Column({ name: "email" })
  @IsEmail()
  @IsOptional()
  @Length(10, 150, {
    message: "El email del usuario debe tener entre 10 y 150 caracteres",
  })
  email: string;

  @Column({ name: "contrasena" })
  @IsString()
  @IsNotEmpty({ message: "La contraseña del usuario es requerida" })
  @Length(8, 150, {
    message: "La contraseña del usuario debe tener entre 8 y 150 caracteres",
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
    message:
      "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial (!@#$%^&*)",
  })
  password: string;

  @Column({ name: "estado" })
  @IsBoolean()
  @IsNotEmpty({ message: "El estado del usuario es requerido" })
  status: boolean;

  @Column({ name: "rol_id" })
  @IsInt()
  @IsNotEmpty({ message: "El rol es requerido" })
  rol: number;

  @Column({ name: "imagen" })
  @IsString()
  @IsOptional()
  photo: string;

  @Column({ name: "area" })
  @IsString()
  @IsNotEmpty({ message: "El área es requerida" })
  @Length(2, 100, { message: "El área debe tener entre 2 y 100 caracteres" })
  area: string;

  @Column({ name: "cargo" })
  @IsString()
  @Length(2, 200, { message: "El cargo debe tener entre 2 y 200 caracteres" })
  @IsNotEmpty({ message: "El cargo es requerido" })
  position: string;

  @Column({ name: "sede_id" })
  @IsInt()
  @IsNotEmpty({ message: "La sede es requerida" })
  headquarters: number;

  @Column({ name: "celular" })
  @IsInt()
  @IsNotEmpty({ message: "El número de celular es requerido" })
  phoneNumber: number;

  @Column({ name: "cargo_id", nullable: true })
  // @IsInt()
  @IsOptional()
  positionId: number;

  @Column({ name: "tipo_contrato", nullable: true })
  @IsEnum(["FIJO", "INDEFINIDO", "POR OBRA O LABOR", "PRESTACION DE SERVICIOS"])
  @IsNotEmpty({ message: "El tipo de contrato es requerido" })
  contractType: string;

  @Column({ name: "fecha_inicio_contrato", type: "date", nullable: true })
  @IsOptional()
  dateStartContract: Date;

  @UpdateDateColumn({ name: "fecha-actualizacion" })
  updatedAt: Date;

  @CreateDateColumn({ name: "fecha-creacion" })
  createdAt: Date;

  // * relaciones con llaves foraneas

  // * relacion con roles
  @ManyToOne(() => Roles, (roles) => roles.usuarioRelation)
  @JoinColumn({ name: "rol_id" })
  rolesRelation: Roles;

  @ManyToOne(
    () => TipoDocumento,
    (tipoDocumento) => tipoDocumento.usuarioRelation
  )
  @JoinColumn({ name: "tipo_cedula_id" })
  typeDocumentRelation: TipoDocumento;

  // * relacion con sede
  @ManyToOne(() => LugarRadicacion, (sede) => sede.userRelation)
  @JoinColumn({ name: "sede_id" })
  sedeRelation: LugarRadicacion;

  // * relacion con carpeta

  @OneToMany(() => Carpeta, (carpeta) => carpeta.userRelation)
  folderRelation: Carpeta[];

  // relacion con radicacion
  @OneToMany(() => Radicacion, (radicacion) => radicacion.usuarioRelation)
  radicacionRelation: Radicacion[];

  // * relacion con seguimiento equipos
  @OneToMany(() => seguimientoEquipos, (seguimientoEquipos) => seguimientoEquipos.userRelation)
  seguimientoEquiposRelation: seguimientoEquipos[];

  // * relacion con seguimiento dispositivos red
  @OneToMany(() => SeguimientoDispositivosRed, (seguimientoDispositivosRed) => seguimientoDispositivosRed.userRelation)
  seguimientoDispositivosRedRelation: SeguimientoDispositivosRed[];

  // relacion con equipos
  @OneToMany(() => Equipos, (equipos) => equipos.userRelation)
  equipmentRelation: Equipos[];

  // * relacion con seguimiento auxiliar
  @OneToMany(() => SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.usuarioRelation)
  seguimientoAuxiliarRelation: SeguimietoAuxiliar[];

  // relacion con pausas activas
  @OneToMany(() => PausasActivas, (pausasActivas) => pausasActivas.userRelation)
  activeBrakesRelation: PausasActivas[];

  @OneToMany(() => CartaRecobro, carta => carta.userAuditRelation)
  cartaUserAuditRelation: CartaRecobro[];

  @OneToMany(() => CartaRecobro, carta => carta.userRequestRelation)
  cartaUserRequestRelation: CartaRecobro[];

  @OneToMany(() => Tickets, tickets => tickets.userRelation)
  ticketsRelation: Tickets[];

  //relacion con notificaciones
  @OneToMany(() => Notification, (notification) => notification.userRelation)
  notificationsRelation: Notification[];

  // ? relacion con push subscription
  @OneToMany(() => PushSubscription, (pushSubscription) => pushSubscription.userRelation)
  pushSubscriptionRelation: PushSubscription[];

  // relacion con encuestas
  @OneToMany(() => EncuestasSatisfaccion, (encuestas) => encuestas.userRelation)
  surveyRelation: EncuestasSatisfaccion[];

  // * relacion con registros de entrada
  @OneToMany(() => RegistroEntrada, (registroEntrada) => registroEntrada.userRelation)
  registerEntriesRelation: RegistroEntrada[];

  // * relacion con seguimiento cirugias
  @OneToMany(() => SeguimientoAuxiliarCirugias, (seguimientoCirugias) => seguimientoCirugias.userRelation)
  gestionCirugiasRelation: SeguimientoAuxiliarCirugias[];

  @OneToMany(() => SeguimientoInventarioGeneral, (seguimientoIvGeneral) => seguimientoIvGeneral.usuario)
  seguimientoInventarioGeneralRelation: SeguimientoInventarioGeneral[];

  // Nuevas relaciones con televisores y celulares
  @OneToMany(() => Televisor, (televisor) => televisor.responsableRelation)
  televisoresRelation: Televisor[];
  
  @OneToMany(() => Celular, (celular) => celular.usuarioRelation)
  celularesRelation: Celular[];
  
  @OneToMany(() => SeguimientoTelevisor, (seguimientoTv) => seguimientoTv.usuarioRelation)
  seguimientoTelevisoresRelation: SeguimientoTelevisor[];
  
  @OneToMany(() => SeguimientoCelular, (seguimientoCel) => seguimientoCel.usuarioRelation)
  seguimientoCelularesRelation: SeguimientoCelular[];

  @OneToMany(() => Comentarios, (comentarios) => comentarios.userRelation)
  commentTicketsRelation: Comentarios[];

  // * Relación con refresh tokens
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.userRelation)
  refreshTokensRelation: RefreshToken[];

  // * Relación con demanda inducida (persona seguimiento)
  @OneToMany(() => DemandaInducida, (demandaInducida) => demandaInducida.personaSeguimientoRelation)
  demandaInducidaSeguimientoRelation: DemandaInducida[];

  // * Relación con cargo
  @ManyToOne(() => Cargo, (cargo) => cargo.usersRelation, { nullable: true })
  @JoinColumn({ name: "cargo_id" })
  cargoRelation: Cargo;
}
