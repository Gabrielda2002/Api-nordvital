import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("autorizacion")
export class Estados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdAutorizacion" })
    id: number;

    @Column({ name: "OpcionAutorizacion" })
    name: string

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date

    // * relaciones
}