import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, EntityMetadata, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { Equipos } from "./equipos";

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

    @Column({name: "size"})
    @IsInt()
    @IsNotEmpty({message: "El tamaño del soporte es requerido"})
    size: number;

    @Column({name: "tipo"})
    @IsString()
    @Length(1, 100, {message: "El tipo del soporte debe tener entre $constraint1 y $constraint2 caracteres"})
    @IsNotEmpty({message: "El tipo del soporte es requerido"})
    type: string;

    @CreateDateColumn({name: "fechaCreacion"})
    createdAt: Date;

    @UpdateDateColumn({name: "fechaActualizacion"})
    updateAt: Date;

    @Column({name: "name_saved"})
    @IsString()
    nameSaved: string;

    //* Relaciones

    @OneToMany(() => Radicacion, radicacion => radicacion.soportesRelation)
    radicacionRelation: Radicacion[];

    @OneToMany(() => Equipos, equipos => equipos.soportRelacion)
    equiposRelation: Equipos[];

}