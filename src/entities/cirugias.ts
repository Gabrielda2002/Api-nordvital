import { IsNotEmpty, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, NumericType, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pacientes } from "./pacientes";
import { Especialidad } from "./especialidad";
import { Radicacion } from "./radicacion";
import { IpsRemite } from "./ips-remite";
import { SeguimientoAuxiliarCirugias } from "./seguimiento-auxiliar-cirugias";

@Entity('cirugias')
export class Cirugias extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'fecha_cirugia'})
    @IsNotEmpty({message: 'La fecha de cirugia es requerida'})
    surgeryDate: Date;

    @Column({name: 'hora_programada'})
    @IsNotEmpty({message: 'La fecha de hospitalizacion es requerida'})
    scheduledTime: string;

    @Column({name: 'ips_remitente'})
    @IsNotEmpty({message: 'La ips remitente es requerida'})
    ipsRemite: number;

    @Column({name: 'observaciones'})
    @IsNotEmpty({message: 'Las observaciones son requeridas'})
    @Length(5, 150, {message: 'Las observaciones deben tener entre $constraint1 y $constraint2 caracteres'})
    observation: string;

    @Column({name: 'estado'})
    @IsNotEmpty({message: 'el estado es requerido'})
    status: boolean;

    @Column({name: 'radicado_id'})
    @IsNotEmpty({message: 'El radicado es requerido'})
    radicadoId: number;

    @Column({name: 'fecha_paraclinico'})
    @IsNotEmpty({message: 'La fecha paraclinico es requerida'})
    paraclinicalDate: Date;

    @Column({name: 'fecha_anesteciologia'})
    @IsNotEmpty({message: 'La fecha de anesteciologia es requerida'})
    anesthesiologyDate: Date;

    @Column({name: 'especialista'})
    @IsNotEmpty({message: 'El especialista es requerido'})
    @Length(3, 255, {message: 'El especialista debe tener entre $constraint1 y $constraint2 caracteres'})
    specialist: string;

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updatedAt'})
    updatedAt: Date;

    // * relaciones

    // * relacion con radicacion
    @ManyToOne(() => Radicacion, (radicacion) => radicacion.cirugiasRelation)
    @JoinColumn({name: 'radicado_id'})
    radicacionRelation: Radicacion;

    // * relacion con ips remite
    @ManyToOne(() => IpsRemite, (ipsRemite) => ipsRemite.cirugiasRelation)
    @JoinColumn({name: 'ips_remitente'})
    ipsRemiteRelation: IpsRemite;

    // * relacion con seguimiento auxiliar cirugias
    @OneToMany(() => SeguimientoAuxiliarCirugias, (seguimientoAuxiliarCirugias) => seguimientoAuxiliarCirugias.cirugiasRelation)
    gestionCirugiasRelation: SeguimientoAuxiliarCirugias[];
}