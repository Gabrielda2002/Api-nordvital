import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "serviciosolicitado"})
export class ServiciosSolicitados extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdServicioSolicitado"})
    id: number;

    @Column({name: "Codigo"})
    @IsString()
    @IsNotEmpty({message: "El código es requerido"})
    @Length(1, 10, {message: "El código debe tener entre $constraint1 y $constraint2 caracteres"})
    code: string;

    @Column({name: "NombreSolicitado"})
    @IsString()
    @IsNotEmpty({message: "El nombre es requerido"})
    @Length(1, 100, {message: "El nombre debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

    @Column({name: "Estado"}) 
    @IsBoolean()
    @IsNotEmpty({message: "El estado es requerido"})
    status: boolean;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date
}