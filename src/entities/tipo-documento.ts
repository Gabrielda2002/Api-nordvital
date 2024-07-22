import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";
import { Usuarios } from "./usuarios";

@Entity("documento")
export class TipoDocumento extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdDocumento"})
    id: number

    @Column({ name: "TipoDocumento"})
    name: string

    @Column({ name: "EstadoDocumento"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.typeDocumentRelation)
    radicacion: Radicacion[]

    @OneToMany(() => Pacientes, (pacientes) => pacientes.documentRelation)
    patientRelation: Pacientes[]

    @OneToMany(()=> Usuarios, (usuarios) => usuarios.typeDocumentRelation)
    usuarioRelation: Usuarios[]

    
}