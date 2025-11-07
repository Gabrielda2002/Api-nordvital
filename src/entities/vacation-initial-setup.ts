import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./usuarios";
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

@Entity({ name: "configuracion_inicial_vacaciones" })
export class VacationInitialSetup extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "usuario_id", type: "int", unique: true })
  @IsInt()
  usuarioId: number;

  @OneToOne(() => Usuarios, { nullable: false })
  @JoinColumn({ name: "usuario_id" })
  usuarioRelation: Usuarios;

  @Column({ name: "fecha_corte", type: "date" })
  @IsDate()
  fechaCorte: Date;

  @Column({ name: "periodos_generados_hasta_corte", type: "int" })
  @IsInt()
  @Min(0)
  periodosGeneradosHastaCorte: number;

  @Column({ name: "periodos_configurados", type: "int", default: 0 })
  @IsInt()
  @Min(0)
  periodosConfigurados: number;

  @Column({ name: "dias_totales_disponibles", type: "decimal", precision: 6, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  diasTotalesDisponibles: number;

  @Column({ name: "requiere_revision_rrhh", type: "boolean", default: true })
  @IsBoolean()
  requiereRevisionRRHH: boolean;

  @Column({ name: "observaciones", type: "text", nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @Column({ name: "configuracion_completa", type: "boolean", default: false })
  @IsBoolean()
  configuracionCompleta: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
