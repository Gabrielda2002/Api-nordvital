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
import { dispositivosRed } from "./dispositivos-red";
import { Usuarios } from "./usuarios";

@Entity({ name: "seguimiento_dispositivos_red" })
export class SeguimientoDispositivosRed extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "dispositivo_id" })
  @IsNumber()
  @IsNotEmpty({ message: "El id del dispositivo es requerido" })
  deviceId: number;

  @Column({ name: "fecha_evento" })
  @IsNotEmpty({ message: "La fecha del evento es requerida" })
  dateEvent: Date;

  @Column({ name: "tipo_evento" })
  @IsString()
  @IsNotEmpty({ message: "El tipo de evento es requerido" })
  @Length(10, 255, {
    message: "El tipo de evento debe tener entre 10 y 255 caracteres",
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
  @IsNumber()
  @IsNotEmpty({ message: "El responsable es requerido" })
  responsible: number;

  @CreateDateColumn({ name: "fecha_creacion" })
  createAt: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  updateAt: Date;

  //relaciones

  //relacion con dispositivos red
  @ManyToOne(
    () => dispositivosRed,
    (device) => device.seguimientoDispositivosRedRelation
  )
  @JoinColumn({ name: "dispositivo_id" })
  deviceRelation: dispositivosRed;

  // relacion con usuarios
  @ManyToOne(() => Usuarios, (user) => user.seguimientoDispositivosRedRelation)
  @JoinColumn({ name: "responsable" })
  userRelation: Usuarios;
}
