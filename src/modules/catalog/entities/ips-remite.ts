import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "../../radicacion/entities";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("ips_remite")
export class IpsRemite extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number

    @Column({ name: "name", type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty({ message: "El nombre de la IPS remitente es requerido" })
    @Length(3, 100, { message: "El nombre de la IPS remitente debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({ name: "status", type: "tinyint", default: 1 })
@IsBoolean()
    @IsNotEmpty({ message: "El estado de la IPS remitente es requerido" })
    status: boolean

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.ipsRemiteRelation)
    radicacionRelation: Radicacion[]

    // * relacion con cirugias
    @OneToMany(() => Radicacion, (radicacion) => radicacion.ipsRemiteRelation)
    cirugiasRelation: Radicacion[]
}