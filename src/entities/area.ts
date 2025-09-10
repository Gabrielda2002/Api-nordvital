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
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Usuarios } from "./usuarios";
import { Cargo } from "./cargo";

@Entity({ name: "area" })
export class Area extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "nombre", unique: true })
  @IsString()
  @IsNotEmpty({ message: "El nombre del área es requerido" })
  @Length(2, 100, {
    message: "El nombre del área debe tener entre 2 y 100 caracteres",
  })
  name: string;

  @Column({ name: "descripcion", nullable: true })
  @IsString()
  @IsOptional()
  @Length(0, 500, {
    message: "La descripción del área debe tener máximo 500 caracteres",
  })
  description: string;

  @Column({ name: "jefe_area_id", nullable: true })
  @IsInt()
  @IsOptional()
  managerId: number;

  @Column({ name: "estado", default: true })
  @IsBoolean()
  @IsNotEmpty({ message: "El estado del área es requerido" })
  status: boolean;

  @CreateDateColumn({ name: "fecha_creacion" })
  createdAt: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  updatedAt: Date;

  // * Relación con jefe de área (usuario)
  @ManyToOne(() => Usuarios, { nullable: true })
  @JoinColumn({ name: "jefe_area_id" })
  managerRelation: Usuarios;

  // * Relación con cargos del área
  @OneToMany(() => Cargo, (cargo) => cargo.areaRelation)
  cargosRelation: Cargo[];
}