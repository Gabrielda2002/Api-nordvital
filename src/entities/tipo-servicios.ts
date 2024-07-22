import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("servicio")
export class TipoServicios extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdServicio" })
    id: number

    @Column({name: "NombreServicio"})
    name: string

    @Column({name: "EstadoServicio"})
    status: string

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.servicesRelation)
    radicacionRelation: Radicacion[]

}