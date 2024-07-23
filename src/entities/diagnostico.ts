import { Cipher } from "crypto";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("diagnostico")
export class Diagnostico extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number

    @Column({ name: "codigo" })
    code: string

    @Column({ name: "descripcion" })
    description: string


    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

}