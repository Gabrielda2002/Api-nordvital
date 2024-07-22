import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";

@Entity("convenio")
export class Convenio extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "IdConvenio"})
    id: number

    @Column({ name: "NombreConvenio"})
    nameAgreement: string

    @Column({ name: "EstadoConvenio"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * Relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.convenio)
    radicacion: Radicacion[]

    @OneToMany(() => Pacientes, (pacientes) => pacientes.convenioRelation)
    patientRelation: Pacientes[]
}