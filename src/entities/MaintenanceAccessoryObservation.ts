import { BaseEntity, Entity } from 'typeorm';
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { AccesoriosEquipos } from './accesorios-equipos';
import { seguimientoEquipos } from './seguimiento-equipos';

@Entity({ name: "maintenance_accessory_observations" })
export class MaintenanceAccessoryObservation extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "monitoring_equipment_id" })
    @IsNumber()
    @IsNotEmpty({ message: "El ID del seguimiento de equipo es requerido" })
    monitoringEquipmentId: number;

    @Column({ name: "accessory_id" })
    @IsNumber()
    @IsNotEmpty({ message: "El ID del accesorio de equipo es requerido" })
    accessoryIdId: number;

    @Column({ name: "observation", type: "text", nullable: true })
    @IsString()
    @Length(0, 500, {
        message: "La observación del accesorio debe tener máximo $constraint2 caracteres",
    })
    observation: string;

    @Column({ name: "status_at_maintenance", type: "varchar", length: 255, nullable: true })
    @IsString()
    @IsOptional()
    statusMaintenance: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @ManyToOne(() => seguimientoEquipos, (seg) => seg.accessoryObservations, { onDelete: "CASCADE" })
    @JoinColumn({ name: "monitoring_equipment_id" })
    monitoringEquipment: seguimientoEquipos;

    @ManyToOne(() => AccesoriosEquipos, (acc) => acc.maintenanceObservations, { onDelete: "CASCADE" })
    @JoinColumn({ name: "accessory_id" })
    accessory: AccesoriosEquipos;

}