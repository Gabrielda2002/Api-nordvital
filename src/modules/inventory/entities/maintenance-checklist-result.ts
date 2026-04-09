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
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { seguimientoEquipos } from "./seguimiento-equipos";
import { MaintenanceChecklistItem } from "./maintenance-checklist-item";

@Entity({ name: "maintenance_checklist_results" })
export class MaintenanceChecklistResult extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "seguimiento_equipo_id" })
  @IsNumber()
  @IsNotEmpty({ message: "El ID del seguimiento de equipo es requerido" })
  seguimientoEquipoId: number;

  @Column({ name: "checklist_item_id" })
  @IsNumber()
  @IsNotEmpty({ message: "El ID del ítem del checklist es requerido" })
  checklistItemId: number;

  @Column({ name: "is_checked", default: false })
  @IsBoolean()
  isChecked: boolean;

  @Column({ name: "checked_at", type: "datetime", nullable: true })
  @IsOptional()
  checkedAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relación con seguimiento de equipos
  @ManyToOne(
    () => seguimientoEquipos,
    (seguimiento) => seguimiento.checklistResults,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "seguimiento_equipo_id" })
  seguimientoEquipoRelation: seguimientoEquipos;

  // Relación con el ítem del checklist
  @ManyToOne(
    () => MaintenanceChecklistItem,
    (item) => item.checklistResults
  )
  @JoinColumn({ name: "checklist_item_id" })
  checklistItemRelation: MaintenanceChecklistItem;
}
