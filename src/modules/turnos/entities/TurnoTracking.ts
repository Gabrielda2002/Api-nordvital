import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Turno } from "./Turno";
import { ModuloAtencion } from "./ModuloAtencion";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity("turno_tracking")
export class TurnoTracking extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "turno_id", type: "int" })
  @IsNotEmpty()
  @IsInt()
  turnoId: number;

  @Column({ name: "status", type: "varchar", length: 50 })
  @IsNotEmpty()
  @IsString()
  status: string;

  @Column({ name: "modulo_id", type: "int", nullable: true })
  @IsOptional()
  @IsInt()
  moduloId?: number | null;

  @Column({ name: "user_id", type: "int", nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number | null;

  @Column({ name: "notes", type: "text", nullable: true })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Turno, (turno) => turno.tracking, { onDelete: "CASCADE" })
  @JoinColumn({ name: "turno_id" })
  turno: Turno;

  @ManyToOne(() => ModuloAtencion, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "modulo_id" })
  modulo?: ModuloAtencion | null;

  @ManyToOne(() => Usuarios, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  user?: Usuarios | null;
}

