import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from "class-validator";
import { Usuarios } from "./usuarios";
import { Soportes } from "./soportes";

export type PermissionRequestType = "HOURLY" | "DAILY" | "MULTI_DAY";
export type ApprovalStatus = "PENDIENTE" | "APROVADO" | "RECHAZADO";

@Entity({ name: "permisos" })
export class Permisos extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "solicitante_id", type: "int" })
  @IsInt()
  applicantId: number;

  @Column({ name: "dias_solicitados", type: "decimal", precision: 5, scale: 2 })
  @IsNumber()
  @Min(0)
  requestedDays: number;

  @Column({ name: "fecha_inicio", type: "date" })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @Column({ name: "fecha_fin", type: "date" })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @Column({ name: "hora_inicio", type: "time", nullable: true })
  @IsOptional()
  @IsString()
  startTimeRequested?: string;

  @Column({ name: "hora_fin", type: "time", nullable: true })
  @IsOptional()
  @IsString()
  endTimeRequested?: string;

  @Column({ name: "tiempo_compensacion", type: "varchar", length: 50, nullable: false })
  @IsString()
  @Length(1, 50)
  compensationTime: string;

  @Column({ name: "no_remunerado", type: "boolean", default: false })
  @IsBoolean()
  nonRemunerated: boolean;

  @Column({ name: "observaciones", type: "varchar", length: 1000, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @Column({ name: "jefe_id", type: "int" })
  @IsInt()
  bossId: number;

  // approvals
  @Column({ name: "estado_jefe", type: "enum", enum: ["PENDIENTE", "APROVADO", "RECHAZADO"], default: "PENDIENTE" })
  @IsEnum(["PENDIENTE", "APROVADO", "RECHAZADO"] as const)
  bossStatus: ApprovalStatus;

  @Column({ name: "fecha_aprob_jefe", type: "datetime", nullable: true })
  @IsOptional()
  @IsDate()
  bossApprovedAt?: Date;

  @Column({ name: "comentario_jefe", type: "varchar", length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  bossComment?: string;

  @Column({ name: "gerencia_id", type: "int", nullable: true })
  @IsInt()
  @IsOptional()
  managementId?: number;

  @Column({ name: "estado_gerencia", type: "enum", enum: ["PENDIENTE", "APROVADO", "RECHAZADO"], default: "PENDIENTE" })
  @IsEnum(["PENDIENTE", "APROVADO", "RECHAZADO"] as const)
  managementStatus: ApprovalStatus;

  @Column({ name: "fecha_aprob_gerencia", type: "datetime", nullable: true })
  @IsOptional()
  @IsDate()
  managementApprovedAt?: Date;

  @Column({ name: "comentario_gerencia", type: "varchar", length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  managementComment?: string;
  
  @CreateDateColumn({ name: "fecha-creacion" })
  createdAt: Date;
  
  @UpdateDateColumn({ name: "fecha-actualizacion" })
  updatedAt: Date;
  
  // single PDF support (optional)
  @ManyToOne(() => Soportes, (s) => s.permissionsRelation, { nullable: true })
  @JoinColumn({ name: "id_soportes" })
  soporteRelation?: Soportes;

  @ManyToOne(() => Usuarios, (u) => u.id)
  @JoinColumn({ name: "solicitante_id" })
  applicantRelation: Usuarios;

  @ManyToOne(() => Usuarios, (u) => u.id)
  @JoinColumn({ name: "jefe_id" })
  bossRelation: Usuarios;

  @ManyToOne(() => Usuarios, (u) => u.id)
  @JoinColumn({ name: "gerencia_id" })
  managementRelation: Usuarios;

}
