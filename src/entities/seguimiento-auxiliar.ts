import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { EstadosSeguimiento } from "./estados-seguimiento";
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsString, Length } from "class-validator";

@Entity({name: "seguimientoauxiliar"})
export class SeguimietoAuxiliar extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdSeguimiento"})
    id: number;

    @CreateDateColumn({name: "fecha-creacion"})
    createdAt: Date;

    @Column({name: "ObservacionSeguimiento"})
    @IsString()
    @IsNotEmpty({message: "La observación es requerida"})
    @Length(10, 200, {message: "La observación debe tener entre 10 y 200 caracteres"})
    observation: string;

    @Column({name: "EstadoSeguimiento"})
    @IsInt()
    @IsNotEmpty({message: "El estado es requerido"})
    status: number;

    @Column({name: "CodigoCups"})
    @IsString()
    @IsNotEmpty({message: "El código cups es requerido"})
    @Length(1, 10, {message: "El código cups debe tener entre 4 y 10 caracteres"})
    codeCups: string;

    @Column({name: "Radicacion"})
    @IsInt()
    idRadicacion: number;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date;

    // * relacion

    @ManyToOne(() => Radicacion, (radicacion) => radicacion.seguimientoAuxiliarRelation)
    @JoinColumn({name: "Radicacion"})
    radicacionRelation: Radicacion;

    // * relacion con estados seguimiento
    @ManyToOne(()=> EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.seguimientoAuxiliarRelation)
    @JoinColumn({name: "EstadoSeguimiento"})
    estadoSeguimientoRelation: EstadosSeguimiento

}