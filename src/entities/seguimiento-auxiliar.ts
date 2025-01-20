import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { EstadosSeguimiento } from "./estados-seguimiento";
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { CupsRadicados } from "./cups-radicados";
import { Usuarios } from "./usuarios";

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

    @Column({name: "id_cups_radicados"})
    @IsInt()
    idRadicacion: number;

    @Column({name: "usuario_id"})
    @IsInt()
    @IsNotEmpty({message: "El usuario es requerido"})
    userId: number;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date;

    // * relacion

    @ManyToOne(() => CupsRadicados, (cupsRadicados) => cupsRadicados.seguimientoAuxiliarRelation)
    @JoinColumn({name: "id_cups_radicados"})
    cupsRadicadosRelation: CupsRadicados;

    // * relacion con estados seguimiento
    @ManyToOne(()=> EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.seguimientoAuxiliarRelation)
    @JoinColumn({name: "EstadoSeguimiento"})
    estadoSeguimientoRelation: EstadosSeguimiento

    // relacion con usuarios
    @ManyToOne(() => Usuarios, usuarios => usuarios.seguimientoAuxiliarRelation)
    @JoinColumn({name: "usuario_id"})
    usuarioRelation: Usuarios
}