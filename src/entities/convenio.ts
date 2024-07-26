import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";
import { IsBoolean, IsNotEmpty, Length } from "class-validator";

@Entity("convenio")
export class Convenio extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "IdConvenio"})
    id: number

    @Column({ name: "NombreConvenio"})
    @IsNotEmpty({message: "El nombre del convenio no puede estar vacío"})
    @Length(3, 50, {message: "El nombre del convenio debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({ name: "Estado", type: "boolean"})
    @IsBoolean({message: "El estado del convenio debe ser un valor booleano"})
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * Relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.convenioRelation)
    radicacionRelation: Radicacion[]

    @OneToMany(() => Pacientes, (pacientes) => pacientes.convenioRelation)
    patientRelation: Pacientes[]
}