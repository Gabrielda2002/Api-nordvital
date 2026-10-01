import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity({
    name: "pps_target_populations",
    comment: "Catálogo de población objetivo del PPS",
})
export class PpsTargetPopulation extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la población objetivo" })
    id: number;

    @Column({ name: "code", type: "varchar", length: 10, comment: "Código oficial de la población objetivo (Ej: 01)" })
    @IsString()
    @IsNotEmpty({ message: "El código de la población objetivo es requerido" })
    @Length(1, 10, { message: "El código de la población objetivo debe tener entre $constraint1 y $constraint2 caracteres" })
    code: string;

    @Column({ name: "description", type: "varchar", length: 255, comment: "Descripción de la población objetivo" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la población objetivo es requerida" })
    @Length(2, 255, { message: "La descripción de la población objetivo debe tener entre $constraint1 y $constraint2 caracteres" })
    description: string;

    @Column({ name: "status", type: "tinyint", width: 1, default: 1, comment: "Estado (1=Activa, 0=Inactiva)" })
    @IsBoolean()
    status: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
