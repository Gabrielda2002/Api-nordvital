import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tickets } from "./tickets";

@Entity({name: 'estado_tickets'})
export class EstadoTickets extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "nombre"})
    name: string;

    @OneToMany(() => Tickets, tickets => tickets.statusRelation)
    ticketsRelation: Tickets[];

}