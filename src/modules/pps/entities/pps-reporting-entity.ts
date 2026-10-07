import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from "class-validator";

export enum IdentificationType {
    NI = "NI",
    DE = "DE",
    DI = "DI",
    MU = "MU",
}

export enum DueYearRelation {
    SAME = "same",
    NEXT = "next",
}

@Entity({
    name: "pps_reporting_entity",
    comment: "Datos de la entidad que reporta el PPS y parámetros de sus reportes (tabla de una sola fila)",
})
export class PpsReportingEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único del registro" })
    id: number;

    @Column({
        name: "identification_type",
        type: "enum",
        enum: IdentificationType,
        default: IdentificationType.NI,
        comment: "Tipo de identificación (NI=NIT, DE=Departamento, DI=Distrito, MU=Municipio)",
    })
    @IsEnum(IdentificationType, { message: "El tipo de identificación no es válido" })
    identificationType: IdentificationType;

    @Column({
        name: "identification_number",
        type: "varchar",
        length: 20,
        comment: "Número de identificación (NIT sin dígito de verificación; código Divipola para DE/DI/MU)",
    })
    @IsString()
    @IsNotEmpty({ message: "El número de identificación es requerido" })
    @Length(1, 20, { message: "El número de identificación debe tener entre $constraint1 y $constraint2 caracteres" })
    identificationNumber: string;

    @Column({ name: "entity_name", type: "varchar", length: 150, comment: "Nombre de la entidad" })
    @IsString()
    @IsNotEmpty({ message: "El nombre de la entidad es requerido" })
    @Length(1, 150, { message: "El nombre de la entidad debe tener entre $constraint1 y $constraint2 caracteres" })
    entityName: string;

    @Column({ name: "logo_path", type: "varchar", length: 255, nullable: true, comment: "Ruta relativa del logo de la entidad" })
    @IsOptional()
    @IsString()
    logoPath?: string;

    @Column({
        name: "programming_file_prefix",
        type: "varchar",
        length: 20,
        default: "PPS190PPPS",
        comment: "Prefijo del archivo plano de programación",
    })
    @IsString()
    @IsNotEmpty({ message: "El prefijo del archivo de programación es requerido" })
    programmingFilePrefix: string;

    @Column({
        name: "monitoring_file_prefix",
        type: "varchar",
        length: 20,
        default: "PPS190SPPS",
        comment: "Prefijo del archivo plano de seguimiento (por confirmar con el lineamiento vigente)",
    })
    @IsString()
    @IsNotEmpty({ message: "El prefijo del archivo de seguimiento es requerido" })
    monitoringFilePrefix: string;

    @Column({
        name: "strict_mode",
        type: "boolean",
        default: true,
        comment: "Modo estricto: la programación solo acepta metas y actividades del catálogo",
    })
    @IsBoolean()
    strictMode: boolean;

    @Column({ name: "programming_due_month", type: "tinyint", default: 1, comment: "Mes límite de entrega de la programación" })
    @IsInt()
    @Min(1, { message: "El mes debe estar entre 1 y 12" })
    @Max(12, { message: "El mes debe estar entre 1 y 12" })
    programmingDueMonth: number;

    @Column({ name: "programming_due_day", type: "tinyint", default: 31, comment: "Día límite de entrega de la programación" })
    @IsInt()
    @Min(1, { message: "El día debe estar entre 1 y 31" })
    @Max(31, { message: "El día debe estar entre 1 y 31" })
    programmingDueDay: number;

    @Column({
        name: "programming_due_year",
        type: "enum",
        enum: DueYearRelation,
        default: DueYearRelation.SAME,
        comment: "Año límite de entrega de la programación (same=misma vigencia, next=año siguiente)",
    })
    @IsEnum(DueYearRelation, { message: "El año limite debe ser igual a 'same' o 'next'" })
    programmingDueYear: DueYearRelation;

    @Column({ name: "monitoring_due_month", type: "tinyint", default: 1, comment: "Mes límite de entrega del seguimiento" })
    @IsInt()
    @Min(1, { message: "El mes debe estar entre 1 y 12" })
    @Max(12, { message: "El mes debe estar entre 1 y 12" })
    monitoringDueMonth: number;

    @Column({ name: "monitoring_due_day", type: "tinyint", default: 31, comment: "Día límite de entrega del seguimiento" })
    @IsInt()
    @Min(1, { message: "El día debe estar entre 1 y 31" })
    @Max(31, { message: "El día debe estar entre 1 y 31" })
    monitoringDueDay: number;

    @Column({
        name: "monitoring_due_year",
        type: "enum",
        enum: DueYearRelation,
        default: DueYearRelation.NEXT,
        comment: "Año límite de entrega del seguimiento (same=misma vigencia, next=año siguiente)",
    })
    @IsEnum(DueYearRelation, { message: "El año limite debe ser igual a 'same' o 'next'" })
    monitoringDueYear: DueYearRelation;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
