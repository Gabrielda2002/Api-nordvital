import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("servicio")
export class TipoServicios extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdServicio" })
    id: number

    @Column({name: "NombreServicio"})
    name: string

    @Column({name: "EstadoServicio"})
    status: string

    @OneToOne(() => Radicacion, (radicacion) => radicacion.servicesRelation)
    radicacionRelation: Radicacion

}