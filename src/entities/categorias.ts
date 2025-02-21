import { IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Tickets } from "./tickets";

@Entity({name: 'categorias'})
export class Categorias extends BaseEntity {
    
    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "nombre"})
    @IsString()
    @IsNotEmpty()
    name: string;

    @OneToMany(() => Tickets, tickets => tickets.categoryRelation)
    ticketsRelation: Tickets[];
}