import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
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

@Entity("radicacion")
export class Radicacion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "IdRadicacion" })
  id: number;

  @CreateDateColumn({ name: "FechaRadicado" })
  createdAt: Date;

  @Column({ name: "TipoDocumento" })
  documentType: number;

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

  @Column({ name: "FechaOrden", type: "date", nullable: true})
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

  @Column({ name: "FechaAuditoria",type: "date", nullable: true })
  auditDate: Date;

  @Column({ name: "JustificacionAuditoria" })
  justify: string;

  // * relaciones

  // ? relacion con tipo de documento
  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.radicacion)
  @JoinColumn({ name: "TipoDocumento" })
  typeDocumentRelation: TipoDocumento;

  // // ? relacion con convenio
  // @OneToMany(() => Convenio, (convenio) => convenio.radicacion)
  // convenio: Convenio[];

  // // ? relacion con ips primaria
  // @OneToMany(() => IpsPrimaria, (ipsPrimaria) => ipsPrimaria.radicacion)
  // ipsPrimariaRelacion: IpsPrimaria[];

  // // ? relacion con lugar de radicacion
  // @OneToMany(() => Especialidad, (Especialidad) => Especialidad.radicacionRelation)
  // specialtyRelation: Especialidad[];

  // // ? relacion con lugar de radicacion
  // @OneToMany(() => LugarRadicacion, (lugarRadicacion) => lugarRadicacion.radicacionRelation)
  // placeRelation: LugarRadicacion[];

  // // ? relacion con ips remitente
  // @OneToMany(() => IpsRemite, (ipsRemite) => ipsRemite.radicacionRelation)
  // ipsRemiteRelation: IpsRemite[];

  // // ? relacion con grupo de servicios
  // @OneToMany(() => GrupoServicios, (grupoServicios) => grupoServicios.radicacionRelation)
  // servicesGroupRelation: GrupoServicios[];

  // // * relacion con tipo de servicios
  // @OneToMany(() => TipoServicios, (servicio) => servicio.radicacionRelation)
  // servicesRelation: TipoServicios[];

  // // ? relacion con quien radica
  // @OneToMany(() => Radicador, (radicador) => radicador.radicacionRelation)
  // radicadorRelation: Radicador[];
}
