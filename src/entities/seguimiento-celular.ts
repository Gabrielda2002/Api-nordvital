import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsDate, IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { Celular } from "./celular";
import { Usuarios } from "./usuarios";

@Entity({ name: "seguimiento_celulares" })
export class SeguimientoCelular extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "celular_id" })
  @IsInt()
  @IsNotEmpty({ message: "El ID del celular es requerido" })
  phoneId: number;

  @Column({ name: "fecha_evento" })
  @IsDate()
  @IsNotEmpty({ message: "La fecha del evento es requerida" })
  eventDate: Date;

  @Column({ name: "tipo_evento" })
  @IsString()
  @IsNotEmpty({ message: "El tipo de evento es requerido" })
  @Length(3, 255, {
    message:
      "El tipo de evento debe tener entre $constraint1 y $constraint2 caracteres",
  })
  eventType: string;

  @Column({ name: "descripcion" })
  @IsString()
  @IsNotEmpty({ message: "La descripción es requerida" })
  @Length(10, 600, {
    message: "La descripción debe tener entre 10 y 600 caracteres",
  })
  description: string;

  @Column({ name: "responsable" })
  @IsInt()
  @IsNotEmpty({ message: "El responsable es requerido" })
  responsable: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Celular, (celular) => celular.seguimientoRelation)
  @JoinColumn({ name: "celular_id" })
  celularRelation: Celular;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: "responsable" })
  usuarioRelation: Usuarios;
}
