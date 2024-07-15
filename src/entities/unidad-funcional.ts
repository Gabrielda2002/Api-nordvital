import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "unidadfuncional"})
export class UnidadFuncional extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdUnidad"})
    id: number;

    @Column({name: "NombreUnidad"})
    name: string;

    @Column({name: "EstadoUnidad"})
    status: string;

}