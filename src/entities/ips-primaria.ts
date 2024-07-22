import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";

@Entity("ipsprimaria")
export class IpsPrimaria extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdIpsPrimaria"})
    id: number

    @Column({name: "NombreIpsPrimaria"})
    nameIpsPrimaria: string

    @Column({name: "EstadoIpsPrimaria"})
    status: string

    @OneToMany(() => Radicacion, (Radicacion) => Radicacion.ipsPrimariaRelacion)
    radicacion: Radicacion[]

    @OneToMany(() => Pacientes, (pacientes) => pacientes.ipsPrimariaRelation)
    patientRelation: Pacientes[]
}