import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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


}