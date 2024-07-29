import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
import { IsBoolean, IsNotEmpty, IsString, Length } from "class-validator";

@Entity("ipsremite")
export class IpsRemite extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "IdIpsRemite"})
    id: number

    @Column({name: "NombreIpsRemite"})
    @IsString()
    @IsNotEmpty({ message: "El nombre de la IPS remitente es requerido" })
    @Length(3, 100, { message: "El nombre de la IPS remitente debe tener entre $constraint1 y $constraint2 caracteres" })
    name: string

    @Column({name: "Estado"})
    @IsBoolean()
    @IsNotEmpty({ message: "El estado de la IPS remitente es requerido" })
    status: boolean

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones

    @OneToMany(() => Radicacion, (radicacion) => radicacion.ipsRemiteRelation)
    radicacionRelation: Radicacion[]
}