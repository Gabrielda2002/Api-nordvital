import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadosSeguimiento } from "./estados-seguimiento";
import { Cirugias } from "./cirugias";
import { ServiciosSolicitados } from "./servicios-solicitados";

@Entity('gestion_auxiliar_cirugias')
export class SeguimientoAuxiliarCirugias extends BaseEntity{

    @PrimaryGeneratedColumn({name: 'id'})
    id: number

    @Column({name: 'observacion'})
    @IsNotEmpty({message: 'La observacion es requerida'})
    observation: string

    @Column({name: 'estado'})
    @IsNotEmpty({message: 'El estado es requerido'})
    status: number;

    @Column({name: 'cup_id'})
    @IsOptional()
    cupsId: number;

    @Column({name: 'cirugia_id'})
    @IsNotEmpty({message: 'La cirugia es requerida'})
    surgeryId: number;

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updatedAt'})
    updateAt: Date;

    // * relaciones

    // * relaicon con estadoseguimiento
    @ManyToOne(() => EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.statusRelation)
    @JoinColumn({name: 'estado'})
    estadoSeguimientoRelation: EstadosSeguimiento;

    // * relacion con cirugias
    @ManyToOne(() => Cirugias, (cirugias) => cirugias.statusRelation)
    @JoinColumn({name: 'cirugia_id'})
    cirugiasRelation: Cirugias;

    // * relacion con cups
    @ManyToOne(() => ServiciosSolicitados, (cirugias) => cirugias.statusRelation)
    @JoinColumn({name: 'cup_id'})
    cupsRelation: Cirugias;

}