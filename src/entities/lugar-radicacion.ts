import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("lugarradicacion")
export class LugarRadicacion extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdLugar"})
    id: number

    @Column({name: "NombreLugar"})
    name: string

    @Column({name: "EstadoLugar"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.placeRelation)
    radicacionRelation: Radicacion[]
}