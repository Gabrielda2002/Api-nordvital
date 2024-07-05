import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("especialidad")
export class Especialidad extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdEspecialidad"})
    id: number

    @Column({name: "NombreEspecialidad"})
    name: string

    @Column({name: "EstadoEspecialidad"})
    status: string

    @OneToOne(() => Radicacion, (radicacion) => radicacion.specialtyRelation)
    radicacionRelation: Radicacion
}