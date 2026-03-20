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
import { Sedes } from "./sedes";
import { IpsRemite } from "./ips-remite";
import { GrupoServicios } from "./grupo-servicios";
import { CupsRadicados } from "./cups-radicados";
import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Pacientes } from "./pacientes";
import { Soportes } from "./soportes";
import { Servicios } from "./servicios";
import { Cirugias } from "./cirugias";
import { Diagnostico } from "./diagnostico";
import { Usuarios } from "./usuarios";
import { CartaRecobro } from "./carta-recobro";
import { Profesionales } from "./profesionales";

@Entity("radicaciones")
export class Radicacion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int", unsigned: true, comment: "Identificador único de la radicación" })
  id: number;

  @CreateDateColumn({ name: "created_at", type: "datetime", comment: "Fecha y hora de creación de la radicación" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime", comment: "Fecha y hora de actualización de la radicación" })
  updatedAt: Date;

  @Column({ name: "order_date", type: "date", comment: "Fecha de la orden" })
  @IsNotEmpty({message: "La fecha de la orden es requerida"})
  orderDate: Date;

  // * lugar de radicacion
  @Column({ name: "place_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "El lugar de radicacion es requerido"})
  placeId: number;

  @Column({ name: "ips_remite_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "La ips remitente es requerida"})
  ipsRemiteId: number;

  @Column({ name: "specialty_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "La especialidad es requerida"})
  specialtyId: number;

  @Column({ name: "service_group_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "El grupo de servicios es requerido"})
  serviceGroupId: number;

  @Column({ name: "service_type_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "El tipo de servicio es requerido"})
  serviceTypeId: number;

  @Column({ name: "filed_by_user_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "Quien radica es requerido"})
  filedByUserId: number;

  @Column({ name: "audit_notes", type: "varchar", length: 255 })
  @IsString()
  @IsNotEmpty({message: "La auditoria es requerida"})
  @Length(3, 100, {message: "La auditoria debe tener entre 3 y 100 caracteres"})
  auditNotes: string;

  @Column({ name: "audit_date", type: "date", nullable: true })
  auditDate: Date;

  @Column({ name: "audit_justification", type: "text" })
  @IsString()
  @IsNotEmpty({message: "La justificacion de la auditoria es requerida"})
  @Length(3, 500, {message: "La justificacion de la auditoria debe tener entre 3 y 100 caracteres"})
  auditJustification: string;

  @Column({ name: "patient_id", type: "int" })
  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @Column({ name: "support_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "El soporte es requerido"})
  supportId: number;

  @Column({ name: "diagnosis_id", type: "int" })
  @IsInt()
  @IsNotEmpty({message: "El diagnostico es requerido"})
  diagnosisId: number;

  @Column({ name: "professional_id", type: "int" })
  @IsNotEmpty({message: "El profesional es requerido"})
  @IsInt()
  professionalId: number;

  @Column({ name: "audit_user_id", type: "int", nullable: true })
  @IsOptional()
  @IsInt()
  auditUserId: number;

  // * relaciones

  // * relaciones con llaves foraneas

  // ? relacion con especialidad
  @ManyToOne(() => Especialidad, (Especialidad) => Especialidad.radicacionRelation)
  @JoinColumn({ name: "specialty_id" })
  specialtyRelation: Especialidad;

  // ? relacion con lugar de radicacion
  @ManyToOne(() => Sedes, (lugarRadicacion) => lugarRadicacion.radicacionRelation)
  @JoinColumn({ name: "place_id" })
  placeRelation: Sedes;

  // ? relacion con ips remitente
  @ManyToOne(() => IpsRemite, (ipsRemite) => ipsRemite.radicacionRelation)
  @JoinColumn({ name: "ips_remite_id" })
  ipsRemiteRelation: IpsRemite;

  // ? relacion con grupo de servicios
  @ManyToOne(() => GrupoServicios, (grupoServicios) => grupoServicios.radicacionRelation)
  @JoinColumn({ name: "service_group_id" })
  servicesGroupRelation: GrupoServicios;

  // * relacion con tipo de servicios
  @ManyToOne(() => Servicios, (servicio) => servicio.radicacionRelation)
  @JoinColumn({ name: "service_type_id" })
  servicesRelation: Servicios;

  // ? relacion con quien radica
  @ManyToOne(() => Usuarios, (usuario) => usuario.radicacionRelation)
  @JoinColumn({ name: "filed_by_user_id" })
  usuarioRelation: Usuarios;

  @ManyToOne(() => Pacientes, (pacientes) => pacientes.radicacionRelation)
  @JoinColumn({ name: "patient_id" })
  patientRelation: Pacientes;

  @ManyToOne(() => Soportes, (soportes) => soportes.radicacionRelation)
  @JoinColumn({ name: "support_id" })
  soportesRelation: Soportes;

  @ManyToOne(() => Diagnostico, (diagnostico) => diagnostico.radicacionRelation)
  @JoinColumn({ name: "diagnosis_id" })
  diagnosticoRelation: Diagnostico;

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
  @JoinColumn({ name: "professional_id" })
  profesionalesRelation: Profesionales;
  
  @ManyToOne(() => Usuarios, (usuario) => usuario.auditRelation)
  @JoinColumn({ name: "audit_user_id" })
  auditUserRelation: Usuarios;

}
