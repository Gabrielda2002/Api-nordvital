import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { Turno } from "./Turno";

@Entity("turnos_encuestas")
export class TurnoEncuesta extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "turno_id", type: "int", unique: true })
  @IsNotEmpty({ message: "El turno es requerido" })
  @IsInt({ message: "El ID de turno debe ser un entero" })
  turnoId: number;

  @Column({ name: "rating", type: "tinyint" })
  @IsNotEmpty({ message: "La calificación es requerida" })
  @IsInt({ message: "La calificación debe ser un entero" })
  @Min(1, { message: "La calificación mínima es 1" })
  @Max(5, { message: "La calificación máxima es 5" })
  rating: number;

  @Column({ name: "comment", type: "text", nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToOne(() => Turno, (turno) => turno.encuesta, { onDelete: "CASCADE" })
  @JoinColumn({ name: "turno_id" })
  turno: Turno;
}

