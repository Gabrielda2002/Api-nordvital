import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { Cirugias } from "./cirugias";

@Entity("especialidad")
export class Especialidad extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdEspecialidad"})
    id: number

    @Column({name: "NombreEspecialidad"})
    @IsString()
    @IsNotEmpty()
    @Length(3, 50, { message: "El nombre de la especialidad debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty()
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.specialtyRelation)
    radicacionRelation: Radicacion[]

}