import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    coment: string;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
    @IsNotEmpty()
    fechaCreacion: Date;

    

}