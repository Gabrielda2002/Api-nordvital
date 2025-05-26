import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Equipos } from "./equipos";
import { Usuarios } from "./usuarios";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

@Entity({ name: "seguimiento_equipos" })
export class seguimientoEquipos extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "equipo_id" })
  @IsNumber()
  @IsNotEmpty({ message: "El id del equipo es requerido" })
  equipmentId: number;

  @Column({ name: "fecha_evento" })
  @IsNotEmpty({ message: "La fecha del evento es requerida" })
  eventDate: Date;

  @Column({ name: "tipo_evento" })
  @IsString()
  @IsNotEmpty({ message: "El tipo de evento es requerido" })
  eventType: string;

  @Column({ name: "descripcion" })
  @IsString()
  @IsNotEmpty({ message: "La descripción es requerida" })
  @Length(10, 600, {
    message: "La descripción debe tener entre 10 y 600 caracteres",
  })
  description: string;

  @Column({ name: "responsable" })
  @IsNumber()
  @IsNotEmpty({ message: "El responsable es requerido" })
  responsible: number;

  // relacion con la tabla equipos
  @ManyToOne(() => Equipos, (equipment) => equipment.seguimientoEquipos)
  @JoinColumn({ name: "equipo_id" })
  equipmentRelation: Equipos;

  // relacion con usuarios
  @ManyToOne(() => Usuarios, (user) => user.seguimientoEquiposRelation)
  @JoinColumn({ name: "responsable" })
  userRelation: Usuarios;
}
