import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Radicacion } from "./radicacion";
@Entity("profesionales")
export class Profesionales extends BaseEntity { 
    @Column({ name: "id", primary: true, type: "int", generated: true })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 255 })
    name: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToMany(() => Radicacion, radicacion => radicacion.profesionalesRelation)
    radicacionRelation: Radicacion[];
}