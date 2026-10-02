import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import { Usuarios } from "../../auth/entities/usuarios";
import { PpsProgrammedActivity } from "./pps-programmed-activity";

@Entity({
    name: "pps_periods",
    comment: "Vigencias (periodos anuales) de programación y seguimiento del PPS",
})
export class PpsPeriod extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la vigencia" })
    id: number;

    @Column({ name: "validity_year", type: "smallint", comment: "Año de la vigencia (solo puede existir una por año)" })
    @IsInt()
    @Min(2017, { message: "El año de la vigencia debe ser mayor o igual a 2017" })
    @Max(2100, { message: "El año de la vigencia debe ser menor o igual a 2100" })
    validityYear: number;

    @Column({ name: "start_date", type: "date", comment: "Fecha de inicio de la vigencia" })
    @IsNotEmpty({ message: "La fecha de inicio de la vigencia es requerida" })
    startDate: Date;

    @Column({ name: "end_date", type: "date", comment: "Fecha de fin de la vigencia" })
    @IsNotEmpty({ message: "La fecha de fin de la vigencia es requerida" })
    endDate: Date;

    @Column({ name: "cutoff_date", type: "date", nullable: true, comment: "Fecha de corte para el reporte de seguimiento" })
    @IsOptional()
    cutoffDate?: Date;

    @Column({ name: "status", type: "boolean", default: true, comment: "Estado (true=activa, false=inactiva)" })
    @IsBoolean()
    status: boolean;

    @Column({ name: "created_by", type: "int", nullable: true, comment: "Usuario que creó la vigencia" })
    @IsOptional()
    @IsInt()
    createdBy?: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relación con el usuario que creó la vigencia
    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: "created_by" })
    userRelation: Usuarios;

    // * relación con actividades programadas
    @OneToMany(() => PpsProgrammedActivity, (activity) => activity.periodRelation)
    programmedActivitiesRelation: PpsProgrammedActivity[];
}
