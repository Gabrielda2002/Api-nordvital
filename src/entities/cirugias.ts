import { IsNotEmpty } from "class-validator";
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

    @Column({name: 'fecha_ordenamiento'})
    @IsNotEmpty({message: 'La fecha de ordenamiento es requerida'})
    orderingDate: Date;

    @Column({name: 'fecha_paraclinicos'})
    @IsNotEmpty({message: 'La fecha de paraclinicos es requerida'})
    paraclinicalDate: Date;

    @Column({name: 'fecha_valoracion_anestencia'})
    @IsNotEmpty({message: 'La fecha de valoracion de anestesia es requerida'})
    anesthesiaAssessmentDate: Date;

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
    observation: string;

    @Column({name: 'nombre_especialista'})
    @IsNotEmpty({message: 'El nombre del especialista es requerido'})
    specialistName: string;

    @Column({name: 'especialidad_id'})
    @IsNotEmpty({message: 'La especialidad es requerida'})
    specialityId: number;

    @Column({name: 'paciente_id'})
    @IsNotEmpty({message: 'El paciente es requerido'})
    patientId: number;

    @Column({name: 'radicado_id'})
    @IsNotEmpty({message: 'El radicado es requerido'})
    radicadoId: number;

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updatedAt'})
    updatedAt: Date;

    // * relaciones

    // * relacion con pacientes
    @ManyToOne(() => Pacientes, (pacientes) => pacientes.cirugiasRelation)
    @JoinColumn({name: 'paciente_id'})
    patientRelation: Pacientes;

    // * relacion con especialidades
    @ManyToOne(() => Especialidad, (especialidades) => especialidades.cirugiasRelation)
    @JoinColumn({name: 'especialidad_id'})
    specialityRelation: Especialidad;

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
    statusRelation: SeguimientoAuxiliarCirugias[];
}