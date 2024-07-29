import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SeguimietoAuxiliar } from "./seguimiento-auxiliar";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("estadoseguimiento")
export class EstadosSeguimiento extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({ name: "NombreEstadoSeguimiento" })
    @IsString()
    @Length(3, 50, { message: "El nombre del estado de seguimiento debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty()
    name: string

    @Column({ name: "Estado" })
    @IsBoolean()
    @IsNotEmpty()
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.estadoSeguimientoRelation)
    seguimientoAuxiliarRelation: SeguimietoAuxiliar[]


}