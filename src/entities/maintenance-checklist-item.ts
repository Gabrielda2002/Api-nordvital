import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { MaintenanceChecklistResult } from "./maintenance-checklist-result";

@Entity({ name: "maintenance_checklist_items" })
export class MaintenanceChecklistItem extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "item_key", unique: true, length: 100 })
  @IsString()
  @IsNotEmpty({ message: "La clave del ítem es requerida" })
  @Length(1, 100, {
    message: "La clave del ítem debe tener entre 1 y 100 caracteres",
  })
  itemKey: string;

  @Column({ name: "label", length: 255 })
  @IsString()
  @IsNotEmpty({ message: "La etiqueta del ítem es requerida" })
  @Length(1, 255, {
    message: "La etiqueta debe tener entre 1 y 255 caracteres",
  })
  label: string;

  @Column({ name: "display_order" })
  @IsNumber()
  @IsNotEmpty({ message: "El orden de visualización es requerido" })
  displayOrder: number;

  @Column({ name: "is_active", default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relación con los resultados del checklist
  @OneToMany(
    () => MaintenanceChecklistResult,
    (result) => result.checklistItemRelation
  )
  checklistResults: MaintenanceChecklistResult[];
}
