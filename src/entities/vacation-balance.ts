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
import { Usuarios } from "./usuarios";
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

@Entity({ name: "balances_vacaciones" })
export class VacationBalance extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "usuario_id", type: "int" })
  @IsInt()
  usuarioId: number;

  @ManyToOne(() => Usuarios, { nullable: false })
  @JoinColumn({ name: "usuario_id" })
  usuarioRelation: Usuarios;

  @Column({ name: "numero_periodo", type: "int" })
  @IsInt()
  @Min(1)
  numeroPeriodo: number;

  @Column({ name: "periodo_inicio", type: "date" })
  @IsDate()
  periodoInicio: Date;

  @Column({ name: "periodo_fin", type: "date" })
  @IsDate()
  periodoFin: Date;

  @Column({ name: "dias_asignados", type: "decimal", precision: 5, scale: 2, default: 15 })
  @IsNumber()
  @Min(0)
  diasAsignados: number;

  @Column({ name: "dias_tomados", type: "decimal", precision: 5, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  diasTomados: number;

  @Column({ name: "dias_disponibles", type: "decimal", precision: 5, scale: 2, default: 15 })
  @IsNumber()
  @Min(0)
  diasDisponibles: number;

  @Column({ name: "fecha_vencimiento", type: "date" })
  @IsDate()
  fechaVencimiento: Date;

  @Column({ name: "vencido", type: "boolean", default: false })
  @IsBoolean()
  vencido: boolean;

  @Column({ name: "configurado_manualmente", type: "boolean", default: false })
  @IsBoolean()
  configuradoManualmente: boolean;

  @Column({ name: "notas", type: "varchar", length: 500, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  notasAdmin?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
