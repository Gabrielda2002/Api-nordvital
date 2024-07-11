import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("convenio")
export class Convenio extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "IdConvenio"})
    id: number

    @Column({ name: "NombreConvenio"})
    nameAgreement: string

    @Column({ name: "EstadoConvenio"})
    status: string

    @Column({name: "roles", type: "text"})
    roles: string

    // @ManyToOne(() => Radicacion, (radicacion) => radicacion.convenio)
    // radicacion: Radicacion
}