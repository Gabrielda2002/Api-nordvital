import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsInt, IsString, Length } from "class-validator";
import { Municipio } from "./municipio";

@Entity("departamentos")
export class departamentos extends BaseEntity{

    @PrimaryGeneratedColumn({name: "id"})
    id: number

    @Column({name: "nombre"})
    @IsString()
    @Length(3, 50, {message: "El nombre del departamento debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string

    @Column({name: "codigo_departamento", nullable: true})
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
    @OneToMany(() => Municipio, (carpeta) => carpeta.departmentRelation)
    folderRelation: Municipio[];

}