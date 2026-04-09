import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "../../radicacion/entities";
import { Pacientes } from "../../patients/entities/pacientes";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("ips_primaria")
export class IpsPrimaria extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "name", type: "varchar", length: 100 })
    @IsNotEmpty({ message: "El nombre de la ips primaria es requerido" })
    @IsString()
    @Length(3, 100, { message: "El nombre de la ips primaria debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status", type: "tinyint", width: 1, default: 1 })
    @IsNotEmpty({ message: "El estado de la ips primaria es requerido" })
    @IsBoolean()
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Pacientes, (pacientes) => pacientes.ipsPrimariaRelation)
    patientRelation: Pacientes[]
}