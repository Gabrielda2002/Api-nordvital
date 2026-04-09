import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "../../radicacion/entities";
import { Pacientes } from "../../patients/entities/pacientes";
import { Usuarios } from "../../auth/entities/usuarios";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { ServiciosEjecutados } from "../../radicacion/entities";

@Entity("document_types")
export class TipoDocumento extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "name", type: "varchar", length: 10 })
    @IsNotEmpty({ message: "El nombre del documento es requerido" })
    @IsString()
    @Length(1, 10, { message: "El nombre del documento debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status", type: "tinyint", width: 1, default: 1 })
    @IsBoolean()
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
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