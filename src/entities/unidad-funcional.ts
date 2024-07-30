import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CupsRadicados } from "./cups-radicados";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity({name: "unidadfuncional"})
export class UnidadFuncional extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUnidad"})
    id: number;

    @Column({name: "NombreUnidad"})
    @IsString()
    @IsNotEmpty({message: "El nombre de la unidad funcional es requerido"})
    @Length(3, 50, {message: "El nombre de la unidad funcional debe tener entre $constraint1 y $constraint2 caracteres"})
    name: string;

    @Column({name: "Estado"})
    @IsBoolean()
    status: boolean;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => CupsRadicados, (cupsradicados) => cupsradicados.functionalUnitRelation)
    cupsRadicadosRelation: CupsRadicados[]


}