import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
@Entity("radicador")
export class Radicador  extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdRadicador"})
    id: number

    @Column({name: "NombreRadicador"})
    @IsString()
    @IsNotEmpty({message: 'El nombre del radicador es requerido'})
    @Length(2, 200, {message: 'El nombre del radicador debe tener entre $constraint1 y $constraint2 caracteres'})
    name: string

    @Column({name: "Estado"})
    @IsBoolean()
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

}