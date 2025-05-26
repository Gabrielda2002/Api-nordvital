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
import { Usuarios } from "./usuarios";
import { InventarioGeneral } from "./inventario-general";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

@Entity("seguimiento_inventario_general")
export class SeguimientoInventarioGeneral extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "item_id" })
  @IsNumber()
  @IsNotEmpty({ message: "El id del item es requerido" })
  itemId: number;

  @Column({ name: "fecha_evento", type: "date" })
  @IsNotEmpty({ message: "La fecha del evento es requerida" })
  fecha_evento: Date;

  @Column({ name: "tipo_evento", length: 200 })
  @IsString()
  @IsNotEmpty({ message: "El tipo de evento es requerido" })
  typeEvent: string;

  @Column({ name: "descripcion", type: "text" })
  @IsString()
  @IsNotEmpty({ message: "La descripción es requerida" })
  @Length(10, 600, {
    message: "La descripción debe tener entre 10 y 600 caracteres",
  })
  description: string;

  @Column({ name: "responsable" })
  @IsNotEmpty({ message: "El responsable es requerido" })
  @IsNumber()
  responsable: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => InventarioGeneral, { onDelete: "CASCADE" })
  @JoinColumn({ name: "item_id" })
  item: InventarioGeneral;

  @ManyToOne(() => Usuarios, { onDelete: "CASCADE" })
  @JoinColumn({ name: "responsable" })
  usuario: Usuarios;
}
