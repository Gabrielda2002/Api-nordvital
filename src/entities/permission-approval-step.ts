import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./usuarios";
import { PermissionRequest } from "./permission-request";
import { StepStatus, StepType } from "../types/permission";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";

@Entity({ name: "solicitudes_permisos_pasos" })
export class PermissionApprovalStep extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "solicitud_id", type: "int" })
  @IsInt()
  requestId: number;

  @Column({ name: "orden", type: "int" })
  @IsInt()
  order: number;

  @Column({ name: "tipo_paso", type: "enum", enum: ["JEFE", "RRHH"] })
  @IsEnum(["JEFE", "RRHH"]) 
  stepType: StepType;

  @Column({ name: "aprobador_rol", type: "varchar", length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  approverRole?: string;

  @Column({ name: "aprobador_usuario_id", type: "int", nullable: true })
  @IsOptional()
  @IsInt()
  approverUserId?: number;

  @Column({ name: "estado", type: "enum", enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "VISTO"], default: "PENDIENTE" })
  @IsEnum(["PENDIENTE", "APROBADO", "RECHAZADO", "VISTO"]) 
  status: StepStatus;

  @Column({ name: "comentario", type: "varchar", length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  comment?: string;

  @Column({ name: "fecha_accion", type: "datetime", nullable: true })
  @IsOptional()
  @IsDate()
  actedAt?: Date;

  @CreateDateColumn({ name: "fecha_creacion" })
  createdAt: Date;

  @ManyToOne(() => PermissionRequest, (r) => r.stepsRelation)
  @JoinColumn({ name: "solicitud_id" })
  requestRelation: PermissionRequest;

  @ManyToOne(() => Usuarios, (u) => u.id)
  @JoinColumn({ name: "aprobador_usuario_id" })
  approverUserRelation?: Usuarios;
}
