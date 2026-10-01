import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity({
    name: "pps_funding_sources",
    comment: "Catálogo de fuentes de recursos del PPS",
})
export class PpsFundingSource extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int", comment: "Identificador único de la fuente de recursos" })
    id: number;

    @Column({ name: "code", type: "varchar", length: 10, comment: "Código oficial de la fuente de recursos (Ej: 01)" })
    @IsString()
    @IsNotEmpty({ message: "El código de la fuente de recursos es requerido" })
    @Length(1, 10, { message: "El código de la fuente de recursos debe tener entre $constraint1 y $constraint2 caracteres" })
    code: string;

    @Column({ name: "description", type: "varchar", length: 255, comment: "Descripción de la fuente de recursos" })
    @IsString()
    @IsNotEmpty({ message: "La descripción de la fuente de recursos es requerida" })
    @Length(2, 255, { message: "La descripción de la fuente de recursos debe tener entre $constraint1 y $constraint2 caracteres" })
    description: string;

    @Column({ name: "status", type: "tinyint", width: 1, default: 1, comment: "Estado (1=Activa, 0=Inactiva)" })
    @IsBoolean()
    status: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
