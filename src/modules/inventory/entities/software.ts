import { IS_ALPHA, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Equipos } from "./equipos";

@Entity({name: "software"})
export class Software extends BaseEntity{

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "equipo_id"})
    @IsNumber()
    equipmentId: number

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty({message: "El nombre es requerido"})
    @Length(3, 200, {message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "version"})
    @IsString()
    @IsNotEmpty({message: "La version es requerida"})
    @Length(3, 200, {message: "La version debe tener entre $constraint1 y $constraint2 caracteres"})
    versions: string

    @Column({name: "licencia"})
    @IsString()
    @IsNotEmpty({message: "La licencia es requerida"})
    @Length(3, 200, {message: "La licencia debe tener entre $constraint1 y $constraint2 caracteres"})
    license: string

    @Column({name: "otros_datos"})
    @IsString()
    @IsNotEmpty({message: "Otros datos son requeridos"})
    @Length(3, 200, {message: "Otros datos deben tener entre $constraint1 y $constraint2 caracteres"})
    otherData: string

    @Column({name: "fecha_instalacion"})
    @IsNotEmpty({message: "La fecha de instalacion es requerido"})
    installDate: Date

    @Column({name: "estado"})
    @IsString()
    @IsNotEmpty({message: "El estado es requerido"})
    @Length(3, 200, {message: "El estado debe tener entre $constraint1 y $constraint2 caracteres"})
    status: string

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date

    @CreateDateColumn({name: "created_at"})
    createdAt: Date

    //relacion con equipos
    @ManyToOne(() => Equipos, equipos => equipos.softwareRelation)
    @JoinColumn({name: "equipo_id"})
    equipmentRelation: Equipos


}