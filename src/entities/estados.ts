import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("autorizacion")
export class Estados extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "IdAutorizacion" })
    id: number;

    @Column({ name: "OpcionAutorizacion" })
    name: string

    // * relaciones
}