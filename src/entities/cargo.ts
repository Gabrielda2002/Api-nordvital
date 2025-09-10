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
import { Area } from "./area";
import { Usuarios } from "./usuarios";

@Entity({ name: "cargo" })
export class Cargo extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "nombre", unique: true })
  @IsString()
  @IsNotEmpty({ message: "El nombre del cargo es requerido" })
  @Length(2, 200, {
    message: "El nombre del cargo debe tener entre 2 y 200 caracteres",
  })
  name: string;

  @Column({ name: "descripcion", nullable: true })
  @IsString()
  @IsOptional()
  @Length(0, 500, {
    message: "La descripción del cargo debe tener máximo 500 caracteres",
  })
  description: string;

  @Column({ name: "area_id", nullable: true })
  @IsInt()
  @IsOptional()
  areaId: number;

  @Column({ name: "estado", default: true })
  @IsBoolean()
  @IsNotEmpty({ message: "El estado del cargo es requerido" })
  status: boolean;

  @CreateDateColumn({ name: "fecha_creacion" })
  createdAt: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  updatedAt: Date;

  // * Relación con área
  @ManyToOne(() => Area, (area) => area.cargosRelation, { nullable: true })
  @JoinColumn({ name: "area_id" })
  areaRelation: Area;

  // * Relación con usuarios que tienen este cargo
  @OneToMany(() => Usuarios, (usuario) => usuario.cargoRelation)
  usersRelation: Usuarios[];
}