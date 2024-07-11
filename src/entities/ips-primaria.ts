import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("ipsprimaria")
export class IpsPrimaria extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdIpsPrimaria"})
    id: number

    @Column({name: "NombreIpsPrimaria"})
    nameIpsPrimaria: string

    @Column({name: "EstadoIpsPrimaria"})
    status: string

    @ManyToOne(() => Radicacion, (Radicacion) => Radicacion.ipsPrimariaRelacion)
    radicacion: Radicacion
}