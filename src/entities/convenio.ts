import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";

@Entity("convenio")
export class Convenio extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "IdConvenio"})
    id: number

    @Column({ name: "NombreConvenio"})
    nameAgreement: string

    @Column({ name: "EstadoConvenio"})
    status: string

    @Column({name: "roles", type: "text"})
    roles: string

    // * Relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.convenio)
    radicacion: Radicacion[]

    @OneToMany(() => Pacientes, (pacientes) => pacientes.convenioRelation)
    patientRelation: Pacientes[]
}