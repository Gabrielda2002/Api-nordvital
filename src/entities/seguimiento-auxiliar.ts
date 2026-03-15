import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadosSeguimiento } from "./estados-seguimiento";
import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { CupsRadicados } from "./cups-radicados";
import { Usuarios } from "./usuarios";

@Entity({ name: "tracking_records" })
export class SeguimientoAuxiliar extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "observation" })
    @IsString()
    @IsNotEmpty({ message: "La observación es requerida" })
    @Length(10, 200, { message: "La observación debe tener entre 10 y 200 caracteres" })
    observation: string;

    @Column({ name: "status_id" })
    @IsInt()
    @IsNotEmpty({ message: "El estado es requerido" })
    statusId: number;

    @Column({ name: "cups_radicado_id" })
    @IsInt()
    cupsRadicadoId: number;

    @Column({ name: "user_id" })
    @IsInt()
    @IsNotEmpty({ message: "El usuario es requerido" })
    userId: number;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // * relacion
    @ManyToOne(() => CupsRadicados, (cupsRadicados) => cupsRadicados.seguimientoAuxiliarRelation)
    @JoinColumn({ name: "cups_radicado_id" })
    cupsRadicadosRelation: CupsRadicados;

    // * relacion con estados seguimiento
    @ManyToOne(() => EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.seguimientoAuxiliarRelation)
    @JoinColumn({ name: "status_id" })
    estadoSeguimientoRelation: EstadosSeguimiento;

    // relacion con usuarios
    @ManyToOne(() => Usuarios, usuarios => usuarios.seguimientoAuxiliarRelation)
    @JoinColumn({ name: "user_id" })
    usuarioRelation: Usuarios;
}