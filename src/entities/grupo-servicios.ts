import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, NumericType, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("gruposervicio")
export class GrupoServicios extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdGrupo"})
    id: number

    @Column({name: "NombreGrupo"})
    name: string

    @Column({name: "Estado"})
    status: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToOne(() => Radicacion, (radicacion) => radicacion.servicesGroupRelation )
    radicacionRelation: Radicacion[]
}