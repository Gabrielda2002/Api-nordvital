import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Convenio } from "./convenio";
import { TipoDocumento } from "./tipo-documento";
import { IpsPrimaria } from "./ips-primaria";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Radicacion } from "./radicacion";
import { Cirugias } from "./cirugias";


@Entity("pacientes")
export class Pacientes extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "Documento"})
    @IsInt()
    @IsNotEmpty({message: "El campo Documento no puede estar vacio"})
    documentType: number;

    @Column({name: "Identificacion"})
    @IsInt()
    @IsNotEmpty({message: "El campo Identificacion no puede estar vacio"})
    documentNumber: number;

    @Column({name: "NombreCompleto"})
    @IsString()
    @IsNotEmpty({message: "El campo NombreCompleto no puede estar vacio"})
    @Length(3, 50, {message: "El campo NombreCompleto debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

    @Column({name: "NumeroCelular"})
    @IsNotEmpty({message: "El campo NumeroCelular no puede estar vacio"})
    @Length(10, 15, {message: "El campo NumeroCelular debe tener 10 caracteres"})
    phoneNumber: string;

    @Column({name: "TelefonoFijo"})
    @IsString()
    @IsOptional()
    @Length(7, 20, {message: "El campo TelefonoFijo debe tener entre $constraint1 y $constraint2 caracteres"})
    landline?: string;

    @Column({name: "Email"})
    @IsEmail()
    @IsNotEmpty({message: "El campo Email no puede estar vacio"})
    email: string;

    @Column({name: "Direccion"})
    @IsString()
    @IsNotEmpty({message: "El campo Direccion no puede estar vacio"})
    address: string;

    @Column({name: "Convenio"})
    @IsInt()
    @IsNotEmpty({message: "El campo Convenio no puede estar vacio"})
    convenio: number;

    @Column({name: "ipsPrimaria"})
    @IsInt()
    @IsNotEmpty({message: "El campo ipsPrimaria no puede estar vacio"})
    ipsPrimaria: number;

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty({message: "El campo Estado no puede estar vacio"})
    status: boolean;

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

    // * relacion con radicacion

    @OneToMany(() => Radicacion, (radicacion) => radicacion.patientRelation)
    radicacionRelation: Radicacion[]
    
}