import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Sedes } from "../../catalog/entities/sedes";

@Entity("turnos_modulos")
export class ModuloAtencion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "headquarter_id", type: "int" })
  @IsNotEmpty({ message: "La sede es requerida" })
  @IsInt({ message: "El ID de sede debe ser un entero" })
  headquarterId: number;

  @Column({ name: "code", type: "varchar", length: 20 })
  @IsNotEmpty({ message: "El código del módulo es requerido" })
  @IsString()
  @Length(1, 20, { message: "El código debe tener entre 1 y 20 caracteres" })
  code: string;

  @Column({ name: "name", type: "varchar", length: 100 })
  @IsNotEmpty({ message: "El nombre del módulo es requerido" })
  @IsString()
  @Length(2, 100, { message: "El nombre debe tener entre 2 y 100 caracteres" })
  name: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @Column({ name: "is_priority", type: "boolean", default: false })
  @IsOptional()
  @IsBoolean({ message: "El tipo de atención prioritaria debe ser booleano" })
  isPriority: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Sedes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "headquarter_id" })
  headquarter: Sedes;
}
