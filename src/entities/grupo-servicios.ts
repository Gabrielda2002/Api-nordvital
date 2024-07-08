import { BaseEntity, Column, Entity, NumericType, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Radicacion } from "./radicacion";

@Entity("gruposervicio")
export class GrupoServicios extends BaseEntity{

    @PrimaryGeneratedColumn({name: "IdGrupo"})
    id: number

    @Column({name: "NombreGrupo"})
    name: string
    @Column({name: "EstadoGrupoServicio"})
    status: string

    @OneToOne(() => Radicacion, (radicacion) => radicacion.servicesGroupRelation )
    radicacionRelation: Radicacion
}