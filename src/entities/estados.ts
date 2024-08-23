import { IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CupsRadicados } from "./cups-radicados";

@Entity("autorizacion")
export class Estados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdAutorizacion" })
    id: number;

    @Column({ name: "OpcionAutorizacion" })
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    @Length(1, 50, { message: "La longitud del nombre debe ser de 1 a 50 caracteres" })
    name: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    // * relacion con cups
    @OneToMany(() => CupsRadicados, (cupsRadicados) => cupsRadicados.statusRelation)
    cupsRelation: CupsRadicados[]
}