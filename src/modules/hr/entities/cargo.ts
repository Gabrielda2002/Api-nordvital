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
import { Area } from "../../catalog/entities/area";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity({ name: "position" })
export class Cargo extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", unique: true })
  @IsString()
  @IsNotEmpty({ message: "El nombre del cargo es requerido" })
  @Length(2, 200, {
    message: "El nombre del cargo debe tener entre 2 y 200 caracteres",
  })
  name: string;

  @Column({ name: "description", nullable: true })
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

  @Column({ name: "status", default: true })
  @IsBoolean()
  @IsNotEmpty({ message: "El estado del cargo es requerido" })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // * Relación con área
  @ManyToOne(() => Area, (area) => area.cargosRelation, { nullable: true })
  @JoinColumn({ name: "area_id" })
  areaRelation: Area;

  // * Relación con usuarios que tienen este cargo
  @OneToMany(() => Usuarios, (usuario) => usuario.positionRelation)
  usersRelation: Usuarios[];
}