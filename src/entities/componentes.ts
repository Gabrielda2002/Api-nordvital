import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
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
import { Equipos } from "./equipos";

@Entity({ name: "componentes" })
export class Componentes extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "equipo_id" })
  @IsNumber()
  @IsNotEmpty({ message: "El id del equipo es requerido" })
  idEquipments: number;

  @Column({ name: "nombre" })
  @IsString()
  @IsNotEmpty({ message: "El nombre es requerido" })
  @Length(3, 200, {
    message:
      "El nombre debe tener entre $constraint1 y $constraint2 caracteres",
  })
  name: string;

  @Column({ name: "marca" })
  @IsString()
  @IsNotEmpty({ message: "La marca es requerida" })
  @Length(2, 200, {
    message: "La marca debe tener entre $constraint1 y $constraint2 caracteres",
  })
  brand: string;

  @Column({ name: "capacidad" })
  @IsString()
  @IsNotEmpty({ message: "La capacidad es requerida" })
  @Length(3, 200, {
    message:
      "La capacidad debe tener entre $constraint1 y $constraint2 caracteres",
  })
  capacity: string;

  @Column({ name: "velocidad" })
  @IsString()
  @IsNotEmpty({ message: "La velocidad es requerida" })
  @Length(3, 200, {
    message:
      "La velocidad debe tener entre $constraint1 y $constraint2 caracteres",
  })
  speed: string;

  @Column({ name: "otras_especificaciones" })
  @IsString()
  @IsNotEmpty({ message: "Otras especificaciones son requeridas" })
  @Length(3, 200, {
    message:
      "Otras especificaciones deben tener entre $constraint1 y $constraint2 caracteres",
  })
  otherData: string;

  @Column({ name: "modelo" })
  @IsString()
  @IsNotEmpty({ message: "El modelo es requerido" })
  @Length(3, 200, {
    message:
      "El modelo debe tener entre $constraint1 y $constraint2 caracteres",
  })
  model: string;

  @Column({ name: "serial" })
  @IsString()
  @IsNotEmpty({ message: "El serial es requerido" })
  @Length(3, 200, {
    message:
      "El serial debe tener entre $constraint1 y $constraint2 caracteres",
  })
  serial: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // relacion con la tabla equipos
  @ManyToOne(() => Equipos, (equipos) => equipos.componentRelation)
  @JoinColumn({ name: "equipo_id" })
  equipmentsRelation: Equipos;
}
