import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { EstadosSeguimiento } from "./estados-seguimiento";

@Entity({name: "seguimientoauxiliar"})
export class SeguimietoAuxiliar extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdSeguimiento"})
    id: number;

    @CreateDateColumn({name: "FechaSeguimiento"})
    createdAt: Date;

    @Column({name: "ObservacionSeguimiento"})
    observation: string;

    @Column({name: "EstadoSeguimiento"})
    status: string;

    @Column({name: "CodigoCups"})
    codeCups: string;

    @Column({name: "Radicacion"})
    idRadicacion: number;

    // * falta crear este campo en la base de datos
    // @UpdateDateColumn()
    // updatedAt: Date;

    // * relacion

    @ManyToOne(() => Radicacion, (radicacion) => radicacion.seguimientoAuxiliarRelation)
    @JoinColumn({name: "Radicacion"})
    radicacionRelation: Radicacion;

    // * relacion con estados seguimiento
    @ManyToOne(()=> EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.seguimientoAuxiliarRelation)
    @JoinColumn({name: "EstadoSeguimiento"})
    estadoSeguimientoRelation: EstadosSeguimiento

}