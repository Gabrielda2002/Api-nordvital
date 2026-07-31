import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsNotEmpty, Length } from "class-validator";

@Entity("pqrs_population_types")
export class TipoPoblacionPqrs extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "name", type: "varchar", length: 100 })
    @IsNotEmpty({ message: "El nombre del tipo de población PQRSDF no puede estar vacío" })
    @Length(3, 100, { message: "El nombre del tipo de población PQRSDF debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status", type: "tinyint", width: 1, default: 1 })
    @IsBoolean({ message: "El estado del tipo de población PQRSDF debe ser un valor booleano" })
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

}
