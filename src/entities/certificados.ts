import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "certificados"})
export class Certificados extends BaseEntity{

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "nombre"})
    @IsNotEmpty({ message: "El nombre es requerido" })
    name: string;

    @Column({name: "numero_cedula"})
    @IsNotEmpty({ message: "El número de cédula es requerido" })
    dni: number;

    @Column({name: "ruta"})
    path: string;

    @Column({name: "tipo"})
    type: string;

    @Column({name: "size"})
    size: number;

    @Column({name: "nombre_guardado"})
    nameSaved: string;

    @CreateDateColumn({name: "fecha_creacion"})
    createAt: Date;
}