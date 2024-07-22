import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";
@Entity("radicador")
export class Radicador  extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdRadicador"})
    id: number

    @Column({name: "NombreRadicador"})
    name: string

    @Column({name: "EstadoRadicador"})
    status: string

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.radicadorRelation)
    radicacionRelation: Radicacion[]
}