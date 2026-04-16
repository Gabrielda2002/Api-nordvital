import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { InfrastructureTicket } from "./infrastructure-ticket";

@Entity({ name: "infrastructure_comments" })
export class InfrastructureComment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "ticket_id", type: "int" })
    @IsNotEmpty({ message: "Ticket ID is required" })
    @IsNumber()
    ticketId: number;

    @Column({ name: "usuario_id", type: "int" })
    @IsNotEmpty({ message: "User ID is required" })
    @IsNumber()
    userId: number;

    @Column({ name: "comentario", type: "text" })
    @IsNotEmpty({ message: "Comment is required" })
    @IsString()
    comment: string;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => InfrastructureTicket, (ticket) => ticket.commentsRelation)
    @JoinColumn({ name: "ticket_id" })
    ticketRelation: InfrastructureTicket;

    @ManyToOne(() => Usuarios, (usuario) => usuario.infrastructureCommentsRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;
}
