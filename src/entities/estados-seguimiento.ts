import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SeguimientoAuxiliar } from "./seguimiento-auxiliar";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";
import { SeguimientoAuxiliarCirugias } from "./seguimiento-auxiliar-cirugias";

@Entity("tracking_statuses")
export class EstadosSeguimiento extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "name", type: "varchar", length: 255 })
    @IsString()
    @Length(3, 50, { message: "El nombre del estado de seguimiento debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty()
    name: string

    @Column({ name: "status", type: "tinyint", default: 1 })
    @IsBoolean()
    @IsNotEmpty()
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => SeguimientoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.estadoSeguimientoRelation)
    seguimientoAuxiliarRelation: SeguimientoAuxiliar[]

    // * relacion con gestion_auxiliar_cirugias
    @OneToMany(() => SeguimientoAuxiliarCirugias, (seguimientoAuxiliarCirugias) => seguimientoAuxiliarCirugias.estadoSeguimientoRelation)
    statusRelation: SeguimientoAuxiliarCirugias[]

}