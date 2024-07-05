import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocumento } from "./tipo-documento";
import { Convenio } from "./convenio";
import { IpsPrimaria } from "./ips-primaria";

@Entity("radicacion")
export class Radicacion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "IdRadicacion" })
  id: number;

  @CreateDateColumn({ name: "FechaRadicado" })
  createdAt: Date;

  @Column({ name: "TipoDocumento" })
  documentType: string;

  @Column({ name: "Identificacion" })
  documentNumber: number;

  @Column({ name: "NombreCompleto" })
  patientName: string;

  @Column({ name: "NumeroCel" })
  phoneNumber: string;

  @Column({ name: "Email" })
  email: string;

  //* telefono fijo
  @Column({ name: "TelFijo" })
  landline: number;

  @Column({ name: "Direccion" })
  address: string;

  // * convenio
  @Column({ name: "Convenio" })
  agreement: number;

  @Column({ name: "IpsPrimaria" })
  ipsPrimaria: number;

  @Column({ name: "FechaOrden" })
  orderDate: Date;

  // * lugar de radicacion
  @Column({ name: "LugarRadicacion" })
  place: number;

  @Column({ name: "IpsRemite" })
  ipsRemitente: number;

  @Column({ name: "Profesional" })
  profetional: string;

  @Column({ name: "Especialidad" })
  specialty: number;

  @Column({ name: "CodDiagnostico" })
  diagnosticCode: string;

  @Column({ name: "DescripcionDiagnostico" })
  diagnosticDescription: string;

  @Column({ name: "GrupoServicios" })
  groupServices: number;

  @Column({ name: "TipoServicio" })
  typeServices: number;

  // * pendiente por cambiar el nombre de argumento
  @Column({ name: "QuienRadica" })
  radicador: number;

  // @Column({name: "NombreSoporte"})
  // nameFileSupport: string

  // @Column({name: "TipoSoporte"})
  // typeFileSupport: string

  // @Column({name: "contenido", type: "longblob"})
  // contentFileSupport: string

  @Column({ name: "Auditora" })
  auditora: string;

  @Column({ name: "FechaAuditoria" })
  auditDate: Date;

  @Column({ name: "JustificacionAuditoria" })
  justify: string;

  // * relaciones

  // ? relacion con tipo de documento
  @OneToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.radicacion)
  @JoinColumn({ name: "TipoDocumento" })
  tipoDocumento: TipoDocumento;

  // ? relacion con convenio
  @OneToOne(() => Convenio, (convenio) => convenio.radicacion)
  @JoinColumn({ name: "Convenio" })
  convenio: Convenio;

  // ? relacion con ips primaria
  @OneToOne(() => IpsPrimaria, (ipsPrimaria) => ipsPrimaria.radicacion)
  @JoinColumn({ name: "IpsPrimaria" })
  ipsPrimariaRelacion: IpsPrimaria;
}
