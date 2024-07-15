import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "servicio"})
export class Servicios extends BaseEntity {

    @PrimaryGeneratedColumn({name: "IdServicio"})
    id: number;

    @Column({name: "NombreServicio"})
    name: string;

    @Column({name: "EstadoServicio"})
    status: string;
}