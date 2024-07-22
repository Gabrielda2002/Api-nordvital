import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.typeDocumentRelation)
    radicacion: Radicacion[]

    @ManyToOne(() => Pacientes, (pacientes) => pacientes.documentRelation)
    patientRelation: Pacientes[]

    @OneToMany(()=> Usuarios, (usuarios) => usuarios.typeDocumentRelation)
    usuarioRelation: Usuarios[]

    
}