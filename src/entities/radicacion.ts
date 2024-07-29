import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocumento } from "./tipo-documento";
import { Convenio } from "./convenio";
import { IpsPrimaria } from "./ips-primaria";
import { Especialidad } from "./especialidad";
import { LugarRadicacion } from "./lugar-radicacion";
import { IpsRemite } from "./ips-remite";
import { GrupoServicios } from "./grupo-servicios";
import { TipoServicios } from "./tipo-servicios";
import { Radicador } from "./radicador";
import { CupsRadicados } from "./cups-radicados";
import { SeguimietoAuxiliar } from "./seguimiento-auxiliar";
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { Pacientes } from "./pacientes";
import { Soportes } from "./soportes";

@Entity("radicacion")
export class Radicacion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "IdRadicacion" })
  id: number;

  @CreateDateColumn({ name: "FechaRadicado" })
  createdAt: Date;

  @Column({ name: "FechaOrden", type: "date", nullable: true})
  @IsNotEmpty({message: "La fecha de la orden es requerida"})
  orderDate: Date;

  // * lugar de radicacion
  @Column({ name: "LugarRadicacion" })
  @IsInt()
  @IsNotEmpty({message: "El lugar de radicacion es requerido"})
  place: number;

  @Column({ name: "IpsRemite" })
  @IsInt()
  @IsNotEmpty({message: "La ips remitente es requerida"})
  ipsRemitente: number;

  @Column({ name: "Profesional" })
  @IsString()
  @IsNotEmpty({message: "El profesional es requerido"})
  @Length(3, 100, {message: "El profesional debe tener entre 3 y 100 caracteres"})
  profetional: string;

  @Column({ name: "Especialidad" })
  @IsInt()
  @IsNotEmpty({message: "La especialidad es requerida"})
  specialty: number;

  @Column({ name: "CodDiagnostico" })
  @IsString()
  @IsNotEmpty({message: "El codigo de diagnostico es requerido"})
  diagnosticCode: string;

  @Column({ name: "DescripcionDiagnostico" })
  @IsString()
  @IsNotEmpty({message: "La descripcion del diagnostico es requerida"})
  diagnosticDescription: string;

  @Column({ name: "GrupoServicios" })
  @IsInt()
  @IsNotEmpty({message: "El grupo de servicios es requerido"})
  groupServices: number;

  @Column({ name: "TipoServicio" })
  @IsInt()
  @IsNotEmpty({message: "El tipo de servicio es requerido"})
  typeServices: number;

  // * pendiente por cambiar el nombre de argumento
  @Column({ name: "QuienRadica" })
  @IsInt()
  @IsNotEmpty({message: "Quien radica es requerido"})
  radicador: number;

  // @Column({name: "NombreSoporte"})
  // nameFileSupport: string

  // @Column({name: "TipoSoporte"})
  // typeFileSupport: string

  // @Column({name: "contenido", type: "longblob"})
  // contentFileSupport: string

  @Column({ name: "Auditora" })
  @IsString()
  @IsNotEmpty({message: "La auditoria es requerida"})
  @Length(3, 100, {message: "La auditoria debe tener entre 3 y 100 caracteres"})
  auditora: string;

  @Column({ name: "FechaAuditoria",type: "date", nullable: true })
  // @IsDate()
  @IsNotEmpty({message: "La fecha de la auditoria es requerida"})
  auditDate: Date;

  @Column({ name: "JustificacionAuditoria" })
  @IsString()
  @IsNotEmpty({message: "La justificacion de la auditoria es requerida"})
  @Length(3, 100, {message: "La justificacion de la auditoria debe tener entre 3 y 100 caracteres"})
  justify: string;

  @Column({ name: "ConceptoAuditoria" })
  @IsNumber()
  @IsNotEmpty({message: "El concepto de la auditoria es requerido"})
  auditConcept: number;

  @Column({ name: "Paciente_id" })
  @IsInt()
  @IsNotEmpty()
  idPatient: number;

  // * relaciones

  // * relaciones con llaves foraneas

  // ? relacion con lugar de radicacion
  @ManyToOne(() => Especialidad, (Especialidad) => Especialidad.radicacionRelation)
  @JoinColumn({ name: "Especialidad" })
  specialtyRelation: Especialidad;

  // ? relacion con lugar de radicacion
  @ManyToOne(() => LugarRadicacion, (lugarRadicacion) => lugarRadicacion.radicacionRelation)
  @JoinColumn({ name: "LugarRadicacion" })
  placeRelation: LugarRadicacion;

  // ? relacion con ips remitente
  @ManyToOne(() => IpsRemite, (ipsRemite) => ipsRemite.radicacionRelation)
  @JoinColumn({ name: "IpsRemite" })
  ipsRemiteRelation: IpsRemite;

  // ? relacion con grupo de servicios
  @ManyToOne(() => GrupoServicios, (grupoServicios) => grupoServicios.radicacionRelation)
  @JoinColumn({ name: "GrupoServicios" })
  servicesGroupRelation: GrupoServicios;

  // * relacion con tipo de servicios
  @ManyToOne(() => TipoServicios, (servicio) => servicio.radicacionRelation)
  @JoinColumn({ name: "TipoServicio" })
  servicesRelation: TipoServicios;

  // ? relacion con quien radica
  @ManyToOne(() => Radicador, (radicador) => radicador.radicacionRelation)
  @JoinColumn({ name: "QuienRadica" })
  radicadorRelation: Radicador;

  @ManyToOne(() => Pacientes, (pacientes) => pacientes.radicacionRelation)
  @JoinColumn({ name: "Paciente_id" })
  patientRelation: Pacientes;




  // * rrelaciones no llaves foraneas

  // ? relacion con cups radicados
  @OneToMany(() => CupsRadicados, (cupsRadicados) => cupsRadicados.radicacionRelation)
  cupsRadicadosRelation: CupsRadicados[];

  // * relacion con seguimiento auxiliar
  @OneToMany(() => SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.radicacionRelation)
  seguimientoAuxiliarRelation: SeguimietoAuxiliar[];


  @OneToMany(() => Soportes, (soportes) => soportes.radicacionRelation)
  soportesRelation: Soportes[];
}
