import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CupsRadicados } from "./cups-radicados";

@Entity({name: "unidadfuncional"})
export class UnidadFuncional extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUnidad"})
    id: number;

    @Column({name: "NombreUnidad"})
    name: string;

    @Column({name: "EstadoUnidad"})
    status: string;

    // * relaciones

    @ManyToOne(() => CupsRadicados, (cupsradicados) => cupsradicados.functionalUnitRelation)
    cupsRadicadosRelation: CupsRadicados


}