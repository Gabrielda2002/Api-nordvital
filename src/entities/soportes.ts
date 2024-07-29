import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, Entity, EntityMetadata, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("soportes")
export class Soportes extends BaseEntity {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "nombre"})
    @IsString()
    @Length(1, 150, {message: "El nombre del soporte debe tener entre $constraint1 y $constraint2 caracteres"})
    @IsNotEmpty({message: "El nombre del soporte es requerido"})
    name: string;

    @Column({name: "url"})
    @IsString()
    @Length(1, 200, {message: "La url del soporte debe tener entre $constraint1 y $constraint2 caracteres"})
    @IsNotEmpty({message: "La url del soporte es requerida"})
    url: string;

    @Column({name: "id_radicacion"})
    // @IsInt()
    @IsNotEmpty({message: "El id de la radicacion es requerido"})
    idRadicacion: number;

    @ManyToOne(() => Radicacion, radicacion => radicacion.soportesRelation)
    @JoinColumn({name: "id_radicacion"})
    radicacionRelation: Radicacion;

}