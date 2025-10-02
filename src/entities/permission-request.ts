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
import { Usuarios } from "./usuarios";
import {
  OverallStatus,
  PermissionCategory,
  PermissionGranularity,
} from "../types/permission";
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";
import { PermissionApprovalStep } from "./permission-approval-step";
import { PermissionAttachment } from "./permission-attachment";

@Entity({ name: "solicitudes_permisos" })
export class PermissionRequest extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "categoria", type: "enum", enum: ["PERMISO", "INCAPACIDAD", "CALAMIDAD", "VACACIONES"] })
  @IsEnum(["PERMISO", "INCAPACIDAD", "CALAMIDAD", "VACACIONES"]) 
  category: PermissionCategory;

  @Column({ name: "granularidad", type: "enum", enum: ["HOURLY", "DAILY", "MULTI_DAY"] })
  @IsEnum(["HOURLY", "DAILY", "MULTI_DAY"]) 
  granularity: PermissionGranularity;

  @Column({ name: "solicitante_id", type: "int" })
  @IsInt()
  requesterId: number;

  @Column({ name: "fecha_inicio", type: "date" })
  @IsDate()
  startDate: Date;

  @Column({ name: "fecha_fin", type: "date" })
  @IsDate()
  endDate: Date;

  @Column({ name: "hora_inicio", type: "time", nullable: true })
  @IsOptional()
  @IsString()
  startTime?: string;

  @Column({ name: "hora_fin", type: "time", nullable: true })
  @IsOptional()
  @IsString()
  endTime?: string;

  @Column({ name: "dias_solicitados", type: "decimal", precision: 5, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  requestedDays?: number;

  @Column({ name: "no_remunerado", type: "boolean", default: false })
  nonRemunerated: boolean;

  @Column({ name: "tiempo_compensacion", type: "varchar", length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  compensationTime?: string;

  @Column({ name: "observaciones", type: "varchar", length: 1000, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @Column({ name: "estado_global", type: "enum", enum: ["PENDIENTE", "EN_REVISION", "APROBADO", "RECHAZADO", "CANCELADO"], default: "PENDIENTE" })
  @IsEnum(["PENDIENTE", "EN_REVISION", "APROBADO", "RECHAZADO", "CANCELADO"]) 
  overallStatus: OverallStatus;

  @CreateDateColumn({ name: "fecha_creacion" })
  createdAt: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  updatedAt: Date;

  @ManyToOne(() => Usuarios, (u) => u.id)
  @JoinColumn({ name: "solicitante_id" })
  requesterRelation: Usuarios;

  @OneToMany(() => PermissionApprovalStep, (step) => step.requestRelation)
  stepsRelation: PermissionApprovalStep[];

  @OneToMany(() => PermissionAttachment, (att) => att.requestRelation)
  attachmentsRelation: PermissionAttachment[];
}
