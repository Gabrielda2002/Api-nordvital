import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "../../radicacion/entities";

@Entity("diagnoses")
export class Diagnostico extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "code", type: "varchar", length: 10 })
    @Matches(/^[a-zA-Z]{1,2}(\d{1,3}[a-zA-Z]?|[a-zA-Z]{1})$/, { message: "El código debe tener 1 o 2 letras seguidas de 1 a 3 dígitos y opcionalmente una letra" })
    @IsNotEmpty({ message: "El codigo es requerido" })
    code: string

    @Column({ name: "description", type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty({ message: "La descripcion es requerido" })
    @Length(1, 255, { message: "La descripción debe tener entre 1 y 255 caracteres" })
    description: string

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @OneToMany(() => Radicacion, (radicacion) => radicacion.diagnosticoRelation)
    radicacionRelation: Radicacion[]

}
