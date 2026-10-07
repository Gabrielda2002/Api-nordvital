import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { PpsProgrammedActivity } from "./pps-programmed-activity";
import { PpsTargetPopulation } from "./pps-target-population";
import { PpsFundingSource } from "./pps-funding-source";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity({
    name: "pps_monitoring",
    comment: "Seguimiento de ejecución por actividad programada (un registro por actividad)",
})
export class PpsMonitoring extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único del registro de seguimiento" })
    id: number;

    @Column({ name: "programmed_activity_id", type: "int", comment: "Actividad programada monitoreada (una fila por actividad)" })
    @IsInt()
    programmedActivityId: number;

    @Column({ name: "result", type: "int", nullable: true, comment: "Resultado: número de veces que se ejecutó la actividad" })
    @IsOptional()
    @IsInt()
    @Min(0, { message: "El resultado no puede ser negativo" })
    result?: number | null;

    @Column({ name: "intervened_population_id", type: "int", nullable: true, comment: "Población intervenida (puede diferir de la población objetivo programada)" })
    @IsOptional()
    @IsInt()
    intervenedPopulationId?: number | null;

    @Column({ name: "total_persons", type: "int", nullable: true, comment: "Total de personas impactadas" })
    @IsOptional()
    @IsInt()
    @Min(0, { message: "El total de personas no puede ser negativo" })
    totalPersons?: number | null;

    @Column({
        name: "executed_resources",
        type: "decimal",
        precision: 12,
        scale: 2,
        nullable: true,
        comment: "Recursos ejecutados (puede ser 0)",
        transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) => (value === null ? null : Number(value)),
        },
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Los recursos ejecutados deben ser un valor numérico" })
    @Min(0, { message: "Los recursos ejecutados no pueden ser negativos" })
    executedResources?: number | null;

    @Column({ name: "funding_source_id", type: "int", nullable: true, comment: "Fuente de los recursos ejecutados" })
    @IsOptional()
    @IsInt()
    fundingSourceId?: number | null;

    @Column({ name: "evidence_link", type: "varchar", length: 500, nullable: true, comment: "Link de la evidencia (mínimo 20 caracteres para completar el seguimiento)" })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: "El link de la evidencia no puede superar los $constraint1 caracteres" })
    evidenceLink?: string | null;

    @Column({ name: "verification_means", type: "varchar", length: 500, nullable: true, comment: "Medio de verificación (mínimo 20 caracteres para completar el seguimiento)" })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: "El medio de verificación no puede superar los $constraint1 caracteres" })
    verificationMeans?: string | null;

    @Column({ name: "updated_by", type: "int", nullable: true, comment: "Usuario que actualizó el seguimiento" })
    @IsOptional()
    @IsInt()
    updatedBy?: number | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relación con la actividad programada
    @OneToOne(() => PpsProgrammedActivity, (activity) => activity.monitoringRelation)
    @JoinColumn({ name: "programmed_activity_id" })
    programmedActivityRelation: PpsProgrammedActivity;

    // * relación con la población intervenida
    @ManyToOne(() => PpsTargetPopulation)
    @JoinColumn({ name: "intervened_population_id" })
    intervenedPopulationRelation: PpsTargetPopulation;

    // * relación con la fuente de recursos
    @ManyToOne(() => PpsFundingSource)
    @JoinColumn({ name: "funding_source_id" })
    fundingSourceRelation: PpsFundingSource;

    // * relación con el usuario que actualizó
    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: "updated_by" })
    userRelation: Usuarios;
}
