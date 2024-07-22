import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("servicio")
export class TipoServicios extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdServicio" })
    id: number

    @Column({name: "NombreServicio"})
    name: string

    @Column({name: "EstadoServicio"})
    status: string
    
    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.servicesRelation)
    radicacionRelation: Radicacion[]

}