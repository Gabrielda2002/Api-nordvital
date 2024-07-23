import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CupsRadicados } from "./cups-radicados";

@Entity({name: "unidadfuncional"})
export class UnidadFuncional extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUnidad"})
    id: number;

    @Column({name: "NombreUnidad"})
    name: string;

    @Column({name: "Estado"})
    status: string;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => CupsRadicados, (cupsradicados) => cupsradicados.functionalUnitRelation)
    cupsRadicadosRelation: CupsRadicados[]


}