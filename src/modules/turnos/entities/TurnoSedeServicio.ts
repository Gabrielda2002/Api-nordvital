import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsNotEmpty } from "class-validator";
import { Sedes } from "../../catalog/entities/sedes";
import { ServicioAtencion } from "../../catalog/entities/servicio-atencion";

@Entity("site_services")
export class TurnoSedeServicio extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "headquarter_id", type: "int" })
  @IsNotEmpty({ message: "La sede es requerida" })
  @IsInt({ message: "El ID de sede debe ser un entero" })
  headquarterId: number;

  @Column({ name: "service_id", type: "int" })
  @IsNotEmpty({ message: "El servicio es requerido" })
  @IsInt({ message: "El ID de servicio debe ser un entero" })
  serviceId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Sedes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "headquarter_id" })
  headquarter: Sedes;

  @ManyToOne(() => ServicioAtencion, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "service_id" })
  service: ServicioAtencion;
}
