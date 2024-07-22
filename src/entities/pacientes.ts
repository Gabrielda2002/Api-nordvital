import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Convenio } from "./convenio";
import { TipoDocumento } from "./tipo-documento";
import { IpsPrimaria } from "./ips-primaria";


@Entity("pacientes")
export class Pacientes extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUsuarios"})
    id: number;

    @Column({name: "Documento"})
    documentType: number;

    @Column({name: "Identificacion"})
    documentNumber: number;

    @Column({name: "NombreCompleto"})
    name: string;

    @Column({name: "NumeroCelular"})
    phoneNumber: number;

    @Column({name: "TelefonoFijo"})
    landline: number;

    @Column({name: "Email"})
    email: string;

    @Column({name: "Direccion"})
    address: string;

    @Column({name: "Convenio"})
    convenio: number;

    @Column({name: "ipsPrimaria"})
    ipsPrimaria: number;

    @Column({name: "EstadoPaciente"})
    status: string;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones 

    // ? relacion con convenio
    @ManyToOne(() => Convenio, (convenio) => convenio.patientRelation )
    @JoinColumn({name: "Convenio"})
    convenioRelation: Convenio

    // ? relacion con documento
    @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.patientRelation)
    @JoinColumn({name: "Documento"})
    documentRelation: TipoDocumento

    // * relacion con ips primaria
    @ManyToOne(()=> IpsPrimaria, (ipsPrimaria) => ipsPrimaria.patientRelation)
    @JoinColumn({name: "ipsPrimaria"})
    ipsPrimariaRelation: IpsPrimaria

    
}