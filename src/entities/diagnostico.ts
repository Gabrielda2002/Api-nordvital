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

    // * falta crear la migracion para estos campos
    // @UpdateDateColumn({ name: "UltimaModificacion" })
    // updatedAt: Date

    // @CreateDateColumn({ name: "FechaRegistro" })
    // createdAt: Date

}