import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("ipsprimaria")
export class IpsPrimaria extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdIpsPrimaria"})
    id: number

    @Column({name: "NombreIpsPrimaria"})
    @IsNotEmpty({message: "El nombre de la ips primaria es requerido"})
    @IsString()
    @Length(3, 50, {message: "El nombre de la ips primaria debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "Estado"})
    @IsNotEmpty({message: "El estado de la ips primaria es requerido"})
    @IsBoolean()
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Pacientes, (pacientes) => pacientes.ipsPrimariaRelation)
    patientRelation: Pacientes[]
}