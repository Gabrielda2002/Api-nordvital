import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("especialidad")
export class Especialidad extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdEspecialidad"})
    id: number

    @Column({name: "NombreEspecialidad"})
    name: string

    @Column({name: "EstadoEspecialidad"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.specialtyRelation)
    radicacionRelation: Radicacion[]
}