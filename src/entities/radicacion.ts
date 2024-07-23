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

  // * relaciones con llaves foraneas

  // ? relacion con tipo de documento
  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.radicacion)
  @JoinColumn({ name: "TipoDocumento" })
  typeDocumentRelation: TipoDocumento;

  // ? relacion con convenio
  @ManyToOne(() => Convenio, (convenio) => convenio.radicacion)
  @JoinColumn({ name: "Convenio" })
  convenio: Convenio;

  // ? relacion con ips primaria
  @ManyToOne(() => IpsPrimaria, (ipsPrimaria) => ipsPrimaria.radicacion)
  @JoinColumn({ name: "IpsPrimaria" })
  ipsPrimariaRelacion: IpsPrimaria;

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

  // * rrelaciones no llaves foraneas

  // ? relacion con cups radicados
  @OneToMany(() => CupsRadicados, (cupsRadicados) => cupsRadicados.radicacionRelation)
  cupsRadicadosRelation: CupsRadicados[];

  // * relacion con seguimiento auxiliar
  @OneToMany(() => SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.radicacionRelation)
  seguimientoAuxiliarRelation: SeguimietoAuxiliar[];
}
