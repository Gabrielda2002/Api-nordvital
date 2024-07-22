import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SeguimietoAuxiliar } from "./seguimiento-auxiliar";

@Entity("estadoseguimiento")
export class EstadosSeguimiento extends BaseEntity{

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({ name: "NombreEstadoSeguimiento" })
    name: string

    @Column({ name: "Estado" })
    status: string

    // @UpdateDateColumn({ name: "UltimaModificacion" })
    // updatedAt: Date

    // @CreateDateColumn({ name: "FechaRegistro" })
    // createdAt: Date

    // * relaciones

    @OneToMany(() => SeguimietoAuxiliar, (seguimientoAuxiliar) => seguimientoAuxiliar.estadoSeguimientoRelation)
    seguimientoAuxiliarRelation: SeguimietoAuxiliar[]


}