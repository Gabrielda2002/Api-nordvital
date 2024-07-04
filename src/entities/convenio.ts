import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("convenio")
export class Convenio extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "IdConvenio"})
    id: number

    @Column({ name: "NombreConvenio"})
    nameAgreement: string

    @Column({ name: "EstadoConvenio"})
    status: string

    @OneToOne(() => Radicacion, (radicacion) => radicacion.convenio)
    radicacion: Radicacion
}