import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Convenio } from "./convenio";
import { TipoDocumento } from "./tipo-documento";
import { IpsPrimaria } from "./ips-primaria";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsString, Length, Matches, MaxLength, ValidateIf } from "class-validator";
import { Radicacion } from "./radicacion";
import { DemandaInducida } from "../modules/demand-induced/entities/demanda-inducida";


@Entity("patients")
export class Pacientes extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id", type: "int", unsigned: true, comment: "Identificador único del paciente"})
    id: number;

    @Column({name: "document_type_id", type: "int"})
    @IsInt()
    @IsNotEmpty({message: "El campo Documento no puede estar vacio"})
    documentTypeId: number;

    @Column({name: "document_number", type: "bigint"})
    @IsString()
    @IsNotEmpty({message: "El campo Identificacion no puede estar vacio"})
    @Matches(/^\d+$/, { message: "El campo Identificacion solo permite numeros" })
    @Length(5,20, {message: "El campo Identificacion debe tener entre $constraint1 y $constraint2 caracteres"})
    documentNumber: string;

    @Column({name: "name", type: "varchar", length: 250})
    @IsString()
    @IsNotEmpty({message: "El campo NombreCompleto no puede estar vacio"})
    @Length(3, 250, {message: "El campo NombreCompleto debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

    @Column({name: "phone_number", type: "varchar", length: 10})
    @IsNotEmpty({message: "El campo NumeroCelular no puede estar vacio"})
    @Length(1, 10, {message: "El campo NumeroCelular debe tener entre $constraint1 y $constraint2 caracteres"})
    phoneNumber: string;

    @Column({name: "landline", nullable: true, type: "varchar", length: 10})
    @ValidateIf((o) => o.landline !== null && o.landline !== undefined && o.landline !== '')
    @IsString()
    @MaxLength(10, {message: "El campo TelefonoFijo no debe exceder los $constraint1 dígitos"})
    landline?: string;

    @Column({name: "phone_number_2", nullable: true, type: "varchar", length: 10})
    @ValidateIf((o) => o.phoneNumber2 !== null && o.phoneNumber2 !== undefined && o.phoneNumber2 !== '')
    @IsString()
    @Length(1, 10, {message: "El campo numeroCelular2 debe tener entre $constraint1 y $constraint2 caracteres"})
    phoneNumber2: string

    @Column({name: "email", type: "varchar", length: 250})
    @IsEmail()
    @IsNotEmpty({message: "El campo Email no puede estar vacio"})
    email: string;

    @Column({name: "address", type: "varchar", length: 250})
    @IsString()
    @IsNotEmpty({message: "El campo Direccion no puede estar vacio"})
    address: string;

    @Column({name: "agreement_id", type: "int"})
    @IsInt()
    @IsNotEmpty({message: "El campo Convenio no puede estar vacio"})
    agreementId: number;

    @Column({name: "ips_primary_id", type: "int"})
    @IsInt()
    @IsNotEmpty({message: "El campo ipsPrimaria no puede estar vacio"})
    ipsPrimaryId: number;

    @Column({name: "status", type: "tinyint"})
    @IsBoolean()
    @IsNotEmpty({message: "El campo Estado no puede estar vacio"})
    status: boolean;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones 

    // ? relacion con convenio
    @ManyToOne(() => Convenio, (convenio) => convenio.patientRelation)
    @JoinColumn({name: "agreement_id"})
    convenioRelation: Convenio

    // ? relacion con documento
    @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.patientRelation)
    @JoinColumn({name: "document_type_id"})
    documentRelation: TipoDocumento

    // * relacion con ips primaria
    @ManyToOne(() => IpsPrimaria, (ipsPrimaria) => ipsPrimaria.patientRelation)
    @JoinColumn({name: "ips_primary_id"})
    ipsPrimariaRelation: IpsPrimaria

    // * relacion con radicacion

    @OneToMany(() => Radicacion, (radicacion) => radicacion.patientRelation)
    radicacionRelation: Radicacion[]

    // * relacion con demanda inducida
    @OneToMany(() => DemandaInducida, (demandaInducida) => demandaInducida.pacienteRelation)
    demandaInducidaRelation: DemandaInducida[];
    
}