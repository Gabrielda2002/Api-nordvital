import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Min } from "class-validator";
import { IsZeroOrAtLeast } from "../utils/is-zero-or-at-least.decorator";
import { PpsPeriod } from "./pps-period";
import { PpsGoal } from "./pps-goal";
import { PpsActivity } from "./pps-activity";
import { PpsTargetPopulation } from "./pps-target-population";
import { PpsMonitoring } from "./pps-monitoring";
import { Sedes } from "../../catalog/entities/sedes";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity({
    name: "pps_programmed_activities",
    comment: "Actividades programadas por vigencia (archivo de programación). Conserva copia de códigos y descripciones para trazabilidad",
})
export class PpsProgrammedActivity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la actividad programada" })
    id: number;

    @Column({ name: "period_id", type: "int", comment: "Vigencia a la que pertenece la actividad programada" })
    @IsInt()
    @IsNotEmpty({ message: "La vigencia es requerida" })
    periodId: number;

    @Column({ name: "headquarters_id", type: "int", comment: "Sede que ejecuta la actividad (de su código de habilitación se deriva el territorio)" })
    @IsInt()
    @IsNotEmpty({ message: "La sede es requerida" })
    headquartersId: number;

    @Column({
        name: "territory_code",
        type: "char",
        length: 5,
        comment: "Código Divipola (5 dígitos) derivado del código de habilitación de la sede al programar",
    })
    @IsString()
    @IsNotEmpty({ message: "El territorio es requerido" })
    @Length(5, 5, { message: "El territorio debe tener $constraint1 dígitos (código Divipola)" })
    territoryCode: string;

    @Column({ name: "action_line_code", type: "varchar", length: 10, comment: "Código de la línea de acción (copia histórica del catálogo)" })
    @IsString()
    @IsNotEmpty({ message: "El código de la línea de acción es requerido" })
    @Length(2, 10, { message: "El código de la línea de acción debe tener entre $constraint1 y $constraint2 caracteres" })
    actionLineCode: string;

    @Column({ name: "goal_id", type: "int", nullable: true, comment: "Meta del catálogo (null cuando se programó manualmente fuera del catálogo)" })
    @IsOptional()
    @IsInt()
    goalId?: number | null;

    @Column({ name: "goal_code", type: "varchar", length: 10, comment: "Consecutivo de la meta (copia histórica)" })
    @IsString()
    @IsNotEmpty({ message: "El consecutivo de la meta es requerido" })
    @Length(2, 10, { message: "El consecutivo de la meta debe tener entre $constraint1 y $constraint2 caracteres" })
    @Matches(/^M\d{2,3}$/i, { message: "El consecutivo de la meta debe tener el formato MXX (Ej: M01)" })
    goalCode: string;

    @Column({ name: "goal_description", type: "varchar", length: 300, comment: "Descripción de la meta (copia histórica de la que se reportó)" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la meta es requerida" })
    @Length(20, 300, { message: "La descripción de la meta debe tener entre $constraint1 y $constraint2 caracteres" })
    @Matches(/^[^;,]*$/, { message: "La descripción de la meta no puede contener comas ni punto y coma" })
    @Matches(/^(?!.*no aplica)/i, { message: "La descripción de la meta no puede ser 'no aplica'" })
    goalDescription: string;

    @Column({ name: "activity_id", type: "int", nullable: true, comment: "Actividad del catálogo (null cuando se programó manualmente fuera del catálogo)" })
    @IsOptional()
    @IsInt()
    activityId?: number | null;

    @Column({ name: "activity_code", type: "varchar", length: 10, comment: "Consecutivo de la actividad (copia histórica)" })
    @IsString()
    @IsNotEmpty({ message: "El consecutivo de la actividad es requerido" })
    @Length(2, 10, { message: "El consecutivo de la actividad debe tener entre $constraint1 y $constraint2 caracteres" })
    @Matches(/^A\d{2,3}$/i, { message: "El consecutivo de la actividad debe tener el formato AXX (Ej: A01)" })
    activityCode: string;

    @Column({ name: "activity_description", type: "varchar", length: 300, comment: "Descripción de la actividad (copia histórica de la que se reportó)" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la actividad es requerida" })
    @Length(20, 300, { message: "La descripción de la actividad debe tener entre $constraint1 y $constraint2 caracteres" })
    @Matches(/^[^;,]*$/, { message: "La descripción de la actividad no puede contener comas ni punto y coma" })
    @Matches(/^(?!.*no aplica)/i, { message: "La descripción de la actividad no puede ser 'no aplica'" })
    activityDescription: string;

    @Column({ name: "numeric_expression", type: "int", comment: "Expresión numérica: veces que se ejecutará la actividad (mayor a 0)" })
    @IsInt({ message: "La expresión numérica debe ser un número entero" })
    @Min(1, { message: "La expresión numérica debe ser mayor a 0" })
    numericExpression: number;

    @Column({ name: "target_population_id", type: "int", comment: "Población objetivo de la actividad" })
    @IsInt({ message: "La población objetivo es inválida" })
    @IsNotEmpty({ message: "La población objetivo es requerida" })
    targetPopulationId: number;

    @Column({ name: "start_date", type: "date", comment: "Fecha de inicio de la actividad (dentro de la vigencia)" })
    @IsNotEmpty({ message: "La fecha de inicio es requerida" })
    startDate: Date;

    @Column({ name: "end_date", type: "date", comment: "Fecha de fin de la actividad (dentro de la vigencia)" })
    @IsNotEmpty({ message: "La fecha de fin es requerida" })
    endDate: Date;

    @Column({
        name: "programmed_resources",
        type: "decimal",
        precision: 12,
        scale: 2,
        comment: "Recursos programados (0 o mayor/igual a 10.000)",
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Los recursos programados deben ser un valor numérico" })
    @IsZeroOrAtLeast(10000, { message: "Los recursos programados deben ser 0 o mayor/igual a 10.000" })
    programmedResources: number;
    
    @Column({ name: "created_by", type: "int", nullable: true, comment: "Usuario que programó la actividad" })
    @IsOptional()
    @IsInt()
    createdBy?: number | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relación con la vigencia
    @ManyToOne(() => PpsPeriod, (period) => period.programmedActivitiesRelation)
    @JoinColumn({ name: "period_id" })
    periodRelation: PpsPeriod;

    // * relación con la sede
    @ManyToOne(() => Sedes)
    @JoinColumn({ name: "headquarters_id" })
    headquartersRelation: Sedes;

    // * relación con la meta del catálogo
    @ManyToOne(() => PpsGoal, { nullable: true })
    @JoinColumn({ name: "goal_id" })
    goalRelation: PpsGoal;

    // * relación con la actividad del catálogo
    @ManyToOne(() => PpsActivity, { nullable: true })
    @JoinColumn({ name: "activity_id" })
    activityRelation: PpsActivity;

    // * relación con la población objetivo
    @ManyToOne(() => PpsTargetPopulation)
    @JoinColumn({ name: "target_population_id" })
    targetPopulationRelation: PpsTargetPopulation;

    // * relación con el usuario que programó
    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: "created_by" })
    userRelation: Usuarios;

    // * relación con el seguimiento (uno a uno)
    @OneToOne(() => PpsMonitoring, (monitoring) => monitoring.programmedActivityRelation)
    monitoringRelation: PpsMonitoring;
}
