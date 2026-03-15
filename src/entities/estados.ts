import { IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CupsRadicados } from "./cups-radicados";
import { Radicacion } from "./radicacion";

@Entity("authorization_statuses")
export class Estados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "name", type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    @Length(1, 50, { message: "La longitud del nombre debe ser de 1 a 50 caracteres" })
    name: string

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    // * relacion con cups
    @OneToMany(() => CupsRadicados, (cupsRadicados) => cupsRadicados.statusRelation)
    cupsRelation: CupsRadicados[]

    // * relacion con radicacion
    @OneToMany(() => Radicacion, (radicacion) => radicacion.statusRelation)
    radicacionRelation: Radicacion[]
}