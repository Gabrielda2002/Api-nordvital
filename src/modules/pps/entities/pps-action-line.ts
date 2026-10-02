import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { PpsGoal } from "./pps-goal";

@Entity({
    name: "pps_action_lines",
    comment: "Catálogo de líneas de acción del Plan de Participación Social en Salud (Resolución 2063 de 2017)",
})
export class PpsActionLine extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la línea de acción" })
    id: number;

    @Column({ name: "code", type: "varchar", length: 10, comment: "Código de la línea de acción (Ej: E1La)" })
    @IsString()
    @IsNotEmpty({ message: "El código de la línea de acción es requerido" })
    @Length(2, 10, { message: "El código de la línea de acción debe tener entre $constraint1 y $constraint2 caracteres" })
    code: string;

    @Column({ name: "description", type: "varchar", length: 400, comment: "Descripción oficial de la línea de acción" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la línea de acción es requerida" })
    @Length(2, 400, { message: "La descripción de la línea de acción debe tener entre $constraint1 y $constraint2 caracteres" })
    description: string;

    @Column({ name: "strategic_axis", type: "varchar", length: 2, comment: "Eje estratégico al que pertenece la línea (E1 a E5)" })
    @IsString()
    @IsNotEmpty({ message: "El eje estratégico es requerido" })
    @Length(2, 2, { message: "El eje estratégico debe tener $constraint1 caracteres (Ej: E1)" })
    strategicAxis: string;

    @Column({ name: "status", type: "boolean", default: true, comment: "Estado (true=activa, false=inactiva)" })
    @IsBoolean()
    status: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relación con metas
    @OneToMany(() => PpsGoal, (goal) => goal.actionLineRelation)
    goalsRelation: PpsGoal[];
}
