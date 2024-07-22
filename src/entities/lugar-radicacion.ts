import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("lugarradicacion")
export class LugarRadicacion extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdLugar"})
    id: number

    @Column({name: "NombreLugar"})
    name: string

    @Column({name: "EstadoLugar"})
    status: string

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.placeRelation)
    radicacionRelation: Radicacion[]
}