import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "../../radicacion/entities";
import { Pacientes } from "../../patients/entities/pacientes";
import { IsBoolean, IsNotEmpty, Length } from "class-validator";
import { NotasTecnicas } from "../../radicacion/entities";
import { ServiciosEjecutados } from "../../radicacion/entities";

@Entity("agreements")
export class Convenio extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

@Column({ name: "name", type: "varchar", length: 100 })
    @IsNotEmpty({ message: "El nombre del convenio no puede estar vacío" })
    @Length(3, 100, { message: "El nombre del convenio debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status", type: "tinyint", width: 1, default: 1 })
    @IsBoolean({ message: "El estado del convenio debe ser un valor booleano" })
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * Relaciones

    @OneToMany(() => Pacientes, (pacientes) => pacientes.convenioRelation)
    patientRelation: Pacientes[]

    // relacion con notas tecnicas
    @OneToMany(() => NotasTecnicas, notasTecnicas => notasTecnicas.convenioRelation)
    notasTecnicasRelation: NotasTecnicas[];
    
    // relacion con servicios ejecutados
    @OneToMany(() => ServiciosEjecutados, servicios => servicios.convenioRelation)
    serviciosEjecutadosRelation: Radicacion[]

}