import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("ipsremite")
export class IpsRemite extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "IdIpsRemite"})
    id: number

    @Column({name: "NombreIpsRemite"})
    name: string

    @Column({name: "EstadoIpsRemite"})
    status: string

    @OneToMany(() => Radicacion, (radicacion) => radicacion.ipsRemiteRelation)
    radicacionRelation: Radicacion[]
}