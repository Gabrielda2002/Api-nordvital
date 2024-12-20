import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Pacientes } from "./pacientes";
import { Usuarios } from "./usuarios";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { ServiciosEjecutados } from "./servicios-ejecutados";

@Entity("documento")
export class TipoDocumento extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdDocumento"})
    id: number

    @Column({ name: "TipoDocumento"})
    @IsNotEmpty({message: "El nombre del documento es requerido"})
    @IsString()
    @Length(1, 4, {message: "El nombre del documento debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({ name: "Estado"})
    @IsBoolean()
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Pacientes, (pacientes) => pacientes.documentRelation)
    patientRelation: Pacientes[]

    @OneToMany(()=> Usuarios, (usuarios) => usuarios.typeDocumentRelation)
    usuarioRelation: Usuarios[]

    // relacion con servicios ejecutados
    @OneToMany(() => ServiciosEjecutados, servicio => servicio.documentTypeRelation)
    serviciosEjecutadosRelation: ServiciosEjecutados[];
    
}