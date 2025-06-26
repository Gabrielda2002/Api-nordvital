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
import { Especialidad } from "./especialidad";
import { LugarRadicacion } from "./lugar-radicacion";
import { IpsRemite } from "./ips-remite";
import { GrupoServicios } from "./grupo-servicios";
import { CupsRadicados } from "./cups-radicados";
import { IsInt, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { Pacientes } from "./pacientes";
import { Soportes } from "./soportes";
import { Servicios } from "./servicios";
import { Cirugias } from "./cirugias";
import { Diagnostico } from "./diagnostico";
import { Usuarios } from "./usuarios";
import { Estados } from "./estados";
import { CartaRecobro } from "./Carta_recobro";
import { Profesionales } from "./profesionales";

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

  @Column({ name: "Auditora" })
  @IsString()
  @IsNotEmpty({message: "La auditoria es requerida"})
  @Length(3, 100, {message: "La auditoria debe tener entre 3 y 100 caracteres"})
  auditora: string;

  @UpdateDateColumn({ name: "FechaAuditoria",type: "date", nullable: true })
  // @IsDate()
  auditDate: Date;

  @Column({ name: "JustificacionAuditoria" })
  @IsString()
  @IsNotEmpty({message: "La justificacion de la auditoria es requerida"})
  @Length(3, 500, {message: "La justificacion de la auditoria debe tener entre 3 y 100 caracteres"})
  justify: string;

  @Column({ name: "ConceptoAuditoria" })
  @IsNumber()
  @IsNotEmpty({message: "El concepto de la auditoria es requerido"})
  auditConcept: number;

  @Column({ name: "Paciente_id" })
  @IsInt()
  @IsNotEmpty()
  idPatient: number;

  @Column({ name: "id_soportes" })
  @IsInt()
  @IsNotEmpty({message: "El soporte es requerido"})
  idSoporte: number;

  @Column({ name: "id_diagnostico", nullable: true })
  @IsInt()
  @IsNotEmpty({message: "El diagnostico es requerido"})
  idDiagnostico: number;

  @Column({ name: "id_profesional", nullable: true })
  idProfesional: number;

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
  @ManyToOne(() => Servicios, (servicio) => servicio.radicacionRelation)
  @JoinColumn({ name: "TipoServicio" })
  servicesRelation: Servicios;

  // ? relacion con quien radica
  @ManyToOne(() => Usuarios, (usuario) => usuario.radicacionRelation)
  @JoinColumn({ name: "QuienRadica" })
  usuarioRelation: Usuarios;

  @ManyToOne(() => Pacientes, (pacientes) => pacientes.radicacionRelation)
  @JoinColumn({ name: "Paciente_id" })
  patientRelation: Pacientes; 

  @ManyToOne(() => Soportes, (soportes) => soportes.radicacionRelation)
  @JoinColumn({ name: "id_soportes" })
  soportesRelation: Soportes;

  @ManyToOne(() => Diagnostico, (diagnostico) => diagnostico.radicacionRelation)
  @JoinColumn({ name: "id_diagnostico" })
  diagnosticoRelation: Diagnostico;

  @ManyToOne(() => Estados, (estados) => estados.radicacionRelation)
  @JoinColumn({ name: "ConceptoAuditoria" })
  statusRelation: Estados;

  // * rrelaciones no llaves foraneas

  // ? relacion con cups radicados
  @OneToMany(() => CupsRadicados, (cupsRadicados) => cupsRadicados.radicacionRelation)
  cupsRadicadosRelation: CupsRadicados[]; 

  // * relacion con cirugias
  @OneToMany(() => Cirugias, (cirugias) => cirugias.radicacionRelation)
  cirugiasRelation: Cirugias[];

  @OneToMany(() => CartaRecobro, carta => carta.radicacionRelation)
  cartaRelation: CartaRecobro[];

  @ManyToOne(() => Profesionales, (profesionales) => profesionales.radicacionRelation)
  @JoinColumn({ name: "id_profesional" })
  profesionalesRelation: Profesionales;

}
