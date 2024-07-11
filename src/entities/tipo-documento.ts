import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("documento")
export class TipoDocumento extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdDocumento"})
    id: number

    @Column({ name: "TipoDocumento"})
    name: string

    @Column({ name: "EstadoDocumento"})
    status: string

    @OneToMany(() => Radicacion, (radicacion) => radicacion.typeDocumentRelation)
    radicacion: Radicacion[]

    
}