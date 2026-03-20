import { IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadosSeguimiento } from "./estados-seguimiento";
import { Cirugias } from "./cirugias";
import { ServiciosSolicitados } from "./servicios-solicitados";
import { Usuarios } from "./usuarios";

@Entity('surgery_tracking_records')
export class SeguimientoAuxiliarCirugias extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number

    @Column({ name: 'observation', type: 'text' })
    @IsNotEmpty({ message: 'La observacion es requerida' })
    observation: string

    @Column({ name: 'status_id', type: 'int' })
    @IsNotEmpty({ message: 'El estado es requerido' })
    statusId: number;

    @Column({ name: 'surgery_id', type: 'int' })
    @IsNotEmpty({ message: 'La cirugia es requerida' })
    surgeryId: number;

    @Column({ name: 'user_id', type: 'int' })
    @IsInt()
    @IsOptional()
    userId?: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // * relaciones

    // * relaicon con estadoseguimiento
    @ManyToOne(() => EstadosSeguimiento, (estadoSeguimiento) => estadoSeguimiento.statusRelation)
    @JoinColumn({ name: 'status_id' })
    estadoSeguimientoRelation: EstadosSeguimiento;

    // * relacion con cirugias
    @ManyToOne(() => Cirugias, (cirugias) => cirugias.gestionCirugiasRelation)
    @JoinColumn({ name: 'surgery_id' })
    cirugiasRelation: Cirugias;

    // * relacion con usuario
    @ManyToOne(() => Usuarios, (usuario) => usuario.gestionCirugiasRelation)
    @JoinColumn({ name: 'user_id' })
    userRelation: Usuarios;

}