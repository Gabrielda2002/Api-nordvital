import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tickets } from "./tickets";

@Entity({name: 'prioridades'})
export class Prioridad extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'nombre'})
    name: string;

    @OneToMany(() => Tickets, tickets => tickets.priorityRelation)
    ticketsRelation: Tickets[];

}