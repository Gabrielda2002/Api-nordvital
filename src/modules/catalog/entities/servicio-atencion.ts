import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsNotEmpty, Length } from "class-validator";

@Entity("attention_services")
export class ServicioAtencion extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "name", type: "varchar", length: 150 })
    @IsNotEmpty({ message: "El nombre del servicio de atención no puede estar vacío" })
    @Length(3, 150, { message: "El nombre del servicio de atención debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status", type: "tinyint", width: 1, default: 1 })
    @IsBoolean({ message: "El estado del servicio de atención debe ser un valor booleano" })
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

}
