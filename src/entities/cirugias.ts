import { IsNotEmpty, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, NumericType, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IpsRemite } from "./ips-remite";
import { SeguimientoAuxiliarCirugias } from "./seguimiento-auxiliar-cirugias";

@Entity('surgeries')
export class Cirugias extends BaseEntity {

    @PrimaryGeneratedColumn({name: 'id', type: "int", unsigned: true, comment: "Identificador único de la cirugía"})
    id: number;

    @Column({name: 'surgery_date', type: "date"})
    @IsNotEmpty({message: 'La fecha de cirugia es requerida'})
    surgeryDate: Date;

    @Column({name: 'scheduled_time', type: "time"})
    @IsNotEmpty({message: 'La fecha de hospitalizacion es requerida'})
    scheduledTime: string;

    @Column({name: 'ips_remite_id', type: "int"})
    @IsNotEmpty({message: 'La ips remitente es requerida'})
    ipsRemiteId: number;

    @Column({name: 'observation', type: "varchar", length: 500})
    @IsNotEmpty({message: 'Las observaciones son requeridas'})
    @Length(5, 150, {message: 'Las observaciones deben tener entre $constraint1 y $constraint2 caracteres'})
    observation: string;

    @Column({name: 'radicacion_id', type: "int"})
    @IsNotEmpty({message: 'El radicado es requerido'})
    radicacionId: number;

    @Column({name: 'paraclinical_date', type: "date"})
    @IsNotEmpty({message: 'La fecha paraclinico es requerida'})
    paraclinicalDate: Date;

    @Column({name: 'anesthesiology_date', type: "date"})
    @IsNotEmpty({message: 'La fecha de anesteciologia es requerida'})
    anesthesiologyDate: Date;

    @Column({name: 'specialist', type: "varchar", length: 255})
    @IsNotEmpty({message: 'El especialista es requerido'})
    @Length(3, 255, {message: 'El especialista debe tener entre $constraint1 y $constraint2 caracteres'})
    specialist: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // * relaciones

    // * relacion con radicacion
    @ManyToOne(() => Radicacion, (radicacion) => radicacion.cirugiasRelation)
    @JoinColumn({name: 'radicacion_id'})
    radicacionRelation: Radicacion;

    // * relacion con ips remite
    @ManyToOne(() => IpsRemite, (ipsRemite) => ipsRemite.cirugiasRelation)
    @JoinColumn({name: 'ips_remite_id'})
    ipsRemiteRelation: IpsRemite;

    // * relacion con seguimiento auxiliar cirugias
    @OneToMany(() => SeguimientoAuxiliarCirugias, (seguimientoAuxiliarCirugias) => seguimientoAuxiliarCirugias.cirugiasRelation)
    gestionCirugiasRelation: SeguimientoAuxiliarCirugias[];
}