import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsInt, IsString, Length } from "class-validator";
import { Municipio } from "./municipio";
import { Carpeta } from "@modules/documents/entities/carpeta";

@Entity("departments")
export class departamentos extends BaseEntity{

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "name"})
    @IsString()
    @Length(3, 50, {message: "El nombre del departamento debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "code", nullable: true})
    @IsInt()
    code: number

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    // ? relacion con municipios
    @OneToMany(() => Municipio, (municipio) => municipio.departmentRelation)
    municipioRelation: Municipio[];

    // ? relacion con carpetas
    @OneToMany(() => Carpeta, (carpeta) => carpeta.departmentRelation)
    folderRelation: Carpeta[];

}