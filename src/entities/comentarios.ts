import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tickets } from "./tickets";
import { Usuarios } from "./usuarios";

@Entity("comentarios")
export class Comentarios extends BaseEntity {
    
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "ticket_id", type: "int" })
    @IsNotEmpty()
    ticketId: number;

    @Column({ name: "usuario_id" })
    @IsNotEmpty()
    usuarioId: number;

    @Column({ name: "comentario", type: "text" })
    @IsNotEmpty()
    comment: string;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => Tickets, (ticket) => ticket.commentRelation)
    @JoinColumn({ name: "ticket_id" })
    ticketsRelation: Tickets;

    @ManyToOne(() => Usuarios, (usuario) => usuario.commentTicketsRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;

}