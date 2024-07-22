import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("ipsremite")
export class IpsRemite extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "IdIpsRemite"})
    id: number

    @Column({name: "NombreIpsRemite"})
    name: string

    @Column({name: "EstadoIpsRemite"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.ipsRemiteRelation)
    radicacionRelation: Radicacion[]
}