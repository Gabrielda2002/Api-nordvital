import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsNotEmpty } from "class-validator";
import { SesionAtencion } from "./SesionAtencion";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";

@Entity("turnos_sesiones_servicios")
export class SesionAtencionServicio extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "sesion_id", type: "int" })
  @IsNotEmpty({ message: "La sesión de atención es requerida" })
  @IsInt({ message: "El ID de sesión debe ser un entero" })
  sesionId: number;

  @Column({ name: "service_id", type: "int" })
  @IsNotEmpty({ message: "El servicio de atención es requerido" })
  @IsInt({ message: "El ID de servicio debe ser un entero" })
  serviceId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => SesionAtencion, (sesion) => sesion.serviciosAsignados, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sesion_id" })
  sesion: SesionAtencion;

  @ManyToOne(() => ServicioAtencion, { onDelete: "CASCADE" })
  @JoinColumn({ name: "service_id" })
  service: ServicioAtencion;
}

