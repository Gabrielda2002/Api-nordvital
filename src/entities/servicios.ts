import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "servicio"})
export class Servicios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdServicio"})
    id: number;

    @Column({name: "NombreServicio"})
    name: string;

    @Column({name: "EstadoServicio"})
    status: string;

    @UpdateDateColumn({ name: "fecha-actualizacion" })
    updatedAt: Date

    @CreateDateColumn({ name: "fecha-creacion" })
    createdAt: Date
}