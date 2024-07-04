import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TipoDocumento } from "./tipo-documento";
import { Convenio } from "./convenio";

@Entity("radicacion")
export class Radicacion extends BaseEntity {

    @PrimaryGeneratedColumn( { name: "IdRadicacion" })
    id: number

    @CreateDateColumn( { name: "FechaRadicado" })
    createdAt: Date

    @Column( { name: "TipoDocumento" })
    documentType: string

    @Column( { name: "Identificacion" })
    documentNumber: number

    @Column( { name: "NombreCompleto"})
    patientName: string

    @Column( { name: "NumeroCel"})
    phoneNumber: string

    @Column( { name: "Email"})
    email: string

    @Column( { name: "TelFijo"})
    landline: number

    @Column( { name: "Direccion"})
    address: string

    @Column( { name: "Convenio"})
    agreement: number

    @OneToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.radicacion )
    @JoinColumn({name : "TipoDocumento"})
    tipoDocumento: TipoDocumento

     @OneToOne(() => Convenio, (convenio) => convenio.radicacion )
     @JoinColumn({name : "Convenio"})
     convenio: Convenio
}