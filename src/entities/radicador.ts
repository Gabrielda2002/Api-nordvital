import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
@Entity("radicador")
export class Radicador  extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdRadicador"})
    id: number

    @Column({name: "NombreRadicador"})
    name: string

    @Column({name: "EstadoRadicador"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.radicadorRelation)
    radicacionRelation: Radicacion[]
}