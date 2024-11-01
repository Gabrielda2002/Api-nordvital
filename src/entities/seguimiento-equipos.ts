import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipos } from "./equipos";

@Entity({name: 'seguimiento_equipos'})
export class seguimientoEquipos extends BaseEntity{

    @PrimaryGeneratedColumn({name: 'id'})
    id: number

    @Column({name: 'equipo_id'})
    equipmentId: number

    @Column({name: 'fecha_evento'})
    eventDate: Date

    @Column({name: 'tipo_evento'})
    eventType: string

    @Column({name: 'descripcion'})
    description: string

    @Column({name: 'responsable'})
    responsible: string

    // relacion con la tabla equipos
    @ManyToOne(() => Equipos, equipment => equipment.seguimientoEquipos)
    @JoinColumn({name: 'equipo_id'})
    equipmentRelation: Equipos

}