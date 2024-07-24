import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("diagnostico")
export class Diagnostico extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({ name: "codigo" })
    @Matches(/^[a-zA-Z]{1,2}(\d{1,3}[a-zA-Z]?|[a-zA-Z]{1})$/, { message: "El código debe tener 1 o 2 letras seguidas de 1 a 3 dígitos y opcionalmente una letra" })
    @IsNotEmpty({message: "El codigo es requerido"})
    code: string

    @Column({ name: "descripcion" })
    @IsString()
    @IsNotEmpty({message: "La descripcion es requerido"})
    @Length(1, 150, {message: "La descripción debe tener entre 1 y 150 caracteres"})
    description: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

}

