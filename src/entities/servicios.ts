import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity({name: "servicio"})
export class Servicios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdServicio"})
    id: number;

    @Column({name: "NombreServicio"})
    @IsString()
    @IsNotEmpty({message: "El nombre del servicio es requerido"})
    @Length(3, 50, {message: "El nombre del servicio debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty({message: "El estado del servicio es requerido"})
    status: boolean;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, radicacion => radicacion.servicesRelation)
    radicacionRelation: Radicacion[]
}