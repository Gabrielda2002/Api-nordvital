import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Usuarios } from "../../auth/entities/usuarios";
import { ModuloAtencion } from "./ModuloAtencion";
import { Sedes } from "../../catalog/entities/sedes";
import { SesionAtencionServicio } from "./SesionAtencionServicio";

@Entity("turnos_sesiones_atencion")
export class SesionAtencion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "user_id", type: "int" })
  @IsNotEmpty({ message: "El usuario asesor es requerido" })
  @IsInt({ message: "El ID de usuario debe ser un entero" })
  userId: number;

  @Column({ name: "modulo_id", type: "int" })
  @IsNotEmpty({ message: "El módulo de atención es requerido" })
  @IsInt({ message: "El ID de módulo debe ser un entero" })
  moduloId: number;

  @Column({ name: "headquarter_id", type: "int" })
  @IsNotEmpty({ message: "La sede es requerida" })
  @IsInt({ message: "El ID de sede debe ser un entero" })
  headquarterId: number;

  @Column({ name: "started_at", type: "timestamp" })
  @IsOptional()
  @IsDate()
  startedAt: Date;

  @Column({ name: "ended_at", type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate()
  endedAt?: Date | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Usuarios, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: Usuarios;

  @ManyToOne(() => ModuloAtencion, { onDelete: "CASCADE" })
  @JoinColumn({ name: "modulo_id" })
  modulo: ModuloAtencion;

  @ManyToOne(() => Sedes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "headquarter_id" })
  headquarter: Sedes;

  @OneToMany(() => SesionAtencionServicio, (sesionServicio) => sesionServicio.sesion)
  serviciosAsignados: SesionAtencionServicio[];
}

