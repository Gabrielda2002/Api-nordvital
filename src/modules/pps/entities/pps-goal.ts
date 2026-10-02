import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsInt, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { PpsActionLine } from "./pps-action-line";
import { PpsActivity } from "./pps-activity";

@Entity({
    name: "pps_goals",
    comment: "Catálogo de metas por línea de acción",
})
export class PpsGoal extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la meta" })
    id: number;

    @Column({ name: "action_line_id", type: "int", comment: "Línea de acción a la que pertenece la meta" })
    @IsInt()
    @IsNotEmpty({ message: "La línea de acción es requerida" })
    actionLineId: number;

    @Column({ name: "code", type: "varchar", length: 10, comment: "Consecutivo de la meta (Ej: M01)" })
    @IsString()
    @IsNotEmpty({ message: "El consecutivo de la meta es requerido" })
    @Length(2, 10, { message: "El consecutivo de la meta debe tener entre $constraint1 y $constraint2 caracteres" })
    code: string;

    @Column({ name: "description", type: "varchar", length: 300, comment: "Descripción de la meta (20 a 300 caracteres, sin comas ni punto y coma)" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la meta es requerida" })
    @Length(20, 300, { message: "La descripción de la meta debe tener entre $constraint1 y $constraint2 caracteres" })
    @Matches(/^[^;,]*$/, { message: "La descripción de la meta no puede contener comas ni punto y coma" })
    description: string;

    @Column({ name: "status", type: "boolean", default: true, comment: "Estado (true=activa, false=inactiva)" })
    @IsBoolean()
    status: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relación con línea de acción
    @ManyToOne(() => PpsActionLine, (actionLine) => actionLine.goalsRelation)
    @JoinColumn({ name: "action_line_id" })
    actionLineRelation: PpsActionLine;

    // * relación con actividades
    @OneToMany(() => PpsActivity, (activity) => activity.goalRelation)
    activitiesRelation: PpsActivity[];
}
