import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsInt, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { PpsGoal } from "./pps-goal";

@Entity({
    name: "pps_activities",
    comment: "Catálogo de actividades por meta",
})
export class PpsActivity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la actividad" })
    id: number;

    @Column({ name: "goal_id", type: "int", comment: "Meta a la que pertenece la actividad" })
    @IsInt()
    @IsNotEmpty({ message: "La meta es requerida" })
    goalId: number;

    @Column({ name: "code", type: "varchar", length: 10, comment: "Consecutivo de la actividad (Ej: A01)" })
    @IsString()
    @IsNotEmpty({ message: "El consecutivo de la actividad es requerido" })
    @Length(2, 10, { message: "El consecutivo de la actividad debe tener entre $constraint1 y $constraint2 caracteres" })
    code: string;

    @Column({ name: "description", type: "varchar", length: 300, comment: "Descripción de la actividad (20 a 300 caracteres, sin comas ni punto y coma)" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la actividad es requerida" })
    @Length(20, 300, { message: "La descripción de la actividad debe tener entre $constraint1 y $constraint2 caracteres" })
    @Matches(/^[^;,]*$/, { message: "La descripción de la actividad no puede contener comas ni punto y coma" })
    description: string;

    @Column({ name: "status", type: "boolean", default: true, comment: "Estado (true=activa, false=inactiva)" })
    @IsBoolean()
    status: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relación con meta
    @ManyToOne(() => PpsGoal, (goal) => goal.activitiesRelation)
    @JoinColumn({ name: "goal_id" })
    goalRelation: PpsGoal;
}
