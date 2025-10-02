import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermissionCategory } from "../types/permission";
import { IsEnum, IsInt, IsNumber, IsOptional } from "class-validator";

@Entity({ name: "politicas_permisos" })
export class PermissionPolicy extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "categoria", type: "enum", enum: ["PERMISO", "INCAPACIDAD", "CALAMIDAD", "VACACIONES"], unique: true })
  @IsEnum(["PERMISO", "INCAPACIDAD", "CALAMIDAD", "VACACIONES"]) 
  category: PermissionCategory;

  @Column({ name: "requiere_documento", type: "boolean", default: false })
  requiresDocument: boolean;

  @Column({ name: "requiere_jefe", type: "boolean", default: false })
  requiresManager: boolean;

  @Column({ name: "requiere_rrhh", type: "boolean", default: false })
  requiresHr: boolean;

  @Column({ name: "requiere_visto_rrhh", type: "boolean", default: false })
  requiresHrAck: boolean;

  @Column({ name: "antiguedad_minima_dias", type: "int", default: 0 })
  @IsInt()
  minTenureDays: number;

  @Column({ name: "max_dias_por_solicitud", type: "decimal", precision: 5, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  maxDaysPerRequest?: number;

  @Column({ name: "max_dias_por_anio", type: "decimal", precision: 5, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  maxDaysPerYear?: number;

  @Column({ name: "permitir_solapamiento", type: "boolean", default: false })
  allowOverlap: boolean;

  @CreateDateColumn({ name: "fecha_creacion" })
  createdAt: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  updatedAt: Date;
}
