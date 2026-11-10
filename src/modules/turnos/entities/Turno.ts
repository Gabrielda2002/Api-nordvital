import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Sedes } from "../../catalog/entities/sedes";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";
import { Pacientes } from "../../patients/entities/pacientes";
import { ModuloAtencion } from "./ModuloAtencion";
import { Usuarios } from "../../auth/entities/usuarios";
import { TurnoTracking } from "./TurnoTracking";
import { TurnoEncuesta } from "./TurnoEncuesta";

export enum TurnoPriority {
  GENERAL = "GENERAL",
  PRIORITARIO = "PRIORITARIO",
}

export enum TurnoStatus {
  PENDIENTE = "PENDIENTE",
  LLAMADO = "LLAMADO",
  EN_ATENCION = "EN_ATENCION",
  FINALIZADO = "FINALIZADO",
  NO_ASISTIO = "NO_ASISTIO",
  CANCELADO = "CANCELADO",
  TRANSFERIDO = "TRANSFERIDO",
}

@Entity("turnos")
export class Turno extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "headquarter_id", type: "int" })
  @IsNotEmpty({ message: "La sede es requerida" })
  @IsInt({ message: "El ID de sede debe ser un entero" })
  headquarterId: number;

  @Column({ name: "service_id", type: "int" })
  @IsNotEmpty({ message: "El servicio es requerido" })
  @IsInt({ message: "El ID de servicio debe ser un entero" })
  serviceId: number;

  @Column({ name: "patient_id", type: "int" })
  @IsNotEmpty({ message: "El paciente es requerido" })
  @IsInt({ message: "El ID de paciente debe ser un entero" })
  patientId: number;

  @Column({ name: "ticket_token", type: "varchar", length: 64, unique: true })
  @IsNotEmpty()
  @IsString()
  ticketToken: string;

  @Column({ name: "ticket_code", type: "varchar", length: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  ticketCode: string;

  @Column({ name: "daily_number", type: "int" })
  @IsNotEmpty()
  @IsInt()
  dailyNumber: number;

  @Column({
    name: "priority",
    type: "enum",
    enum: TurnoPriority,
    default: TurnoPriority.GENERAL,
  })
  @IsEnum(TurnoPriority)
  priority: TurnoPriority;

  @Column({
    name: "status",
    type: "enum",
    enum: TurnoStatus,
    default: TurnoStatus.PENDIENTE,
  })
  @IsEnum(TurnoStatus)
  status: TurnoStatus;

  @Column({ name: "current_modulo_id", type: "int", nullable: true })
  @IsOptional()
  @IsInt()
  currentModuloId?: number | null;

  @Column({ name: "current_user_id", type: "int", nullable: true })
  @IsOptional()
  @IsInt()
  currentUserId?: number | null;

  @Column({ name: "call_count", type: "int", default: 0 })
  @IsOptional()
  @IsInt()
  callCount: number;

  @Column({ name: "called_at", type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate()
  calledAt?: Date | null;

  @Column({ name: "started_at", type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate()
  startedAt?: Date | null;

  @Column({ name: "finished_at", type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate()
  finishedAt?: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Sedes, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "headquarter_id" })
  headquarter: Sedes;

  @ManyToOne(() => ServicioAtencion, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "service_id" })
  service: ServicioAtencion;

  @ManyToOne(() => Pacientes, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "patient_id" })
  patient: Pacientes;

  @ManyToOne(() => ModuloAtencion, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "current_modulo_id" })
  currentModulo?: ModuloAtencion | null;

  @ManyToOne(() => Usuarios, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "current_user_id" })
  currentUser?: Usuarios | null;

  @OneToMany(() => TurnoTracking, (tracking) => tracking.turno)
  tracking: TurnoTracking[];

  @OneToOne(() => TurnoEncuesta, (encuesta) => encuesta.turno)
  encuesta?: TurnoEncuesta;
}

