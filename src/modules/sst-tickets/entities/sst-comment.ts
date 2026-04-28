import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { SstTicket } from "./sst-ticket";

@Entity({ name: "sst_comments" })
export class SstComment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "ticket_id", type: "int" })
    @IsNumber({}, { message: "Ticket ID must be a number" })
    @IsNotEmpty({ message: "Ticket ID is required" })
    ticketId: number;

    @Column({ name: "user_id", type: "int" })
    @IsNumber({}, { message: "User ID must be a number" })
    @IsNotEmpty({ message: "User ID is required" })
    userId: number;

    @Column({ name: "comment", type: "text" })
    @IsNotEmpty({ message: "Comment is required" })
    @IsString()
    comment: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => SstTicket, (ticket) => ticket.commentsRelation)
    @JoinColumn({ name: "ticket_id" })
    ticketRelation: SstTicket;

    @ManyToOne(() => Usuarios, (usuario) => usuario.sstCommentsRelation)
    @JoinColumn({ name: "user_id" })
    userRelation: Usuarios;
}
