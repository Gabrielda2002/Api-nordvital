import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { Categorias } from "./categorias";
import { Prioridad } from "./prioridad";
import { EstadoTickets } from "./estado-tickets";
import { Comentarios } from "./comentarios";
import { EncuestasSatisfaccion } from "../../../entities/encuestas-satisfaccion";
import { TicketAttachment } from "./ticket-attachment";
import { IsBoolean, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";

type TypeTicket = ["Solicitud", "Incidente"];
@Entity("tickets")
export class Tickets extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "titulo", length: 255, type: "varchar" })
    @Length(1, 50, { message: "Title must be between $constraint1 and $constraint2 characters" })
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column({ name: "descripcion", type: "text" })
    @Length(1, 500, { message: "Description must be between $constraint1 and $constraint2 characters" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @Column({ name: "usuario_id", type: "int" })
    @IsNotEmpty()
    userId: number;

    @Column({ name: "categoria_id", type: "int" })
    @IsNotEmpty()
    categoryId: number;

    @Column({ name: "estado_id", type: "int" })
    @IsNotEmpty()
    statusId: number;

    @Column({ name: "prioridad_id", default: 4, type: "int" })
    @IsNotEmpty()
    priorityId: number;

    @Column({ name: 'remoto', type: "tinyint", width: 1, default: 0 })
    @IsBoolean()
    remote: boolean;

    @Column({ name: "tipo", type: "enum", enum: ["Solicitud", "Incidente"], default: "Solicitud" })
    @IsEnum(["Solicitud", "Incidente"], { message: "Type must be either 'Solicitud' or 'Incidente'" })
    @IsNotEmpty()
    type: TypeTicket;

    @CreateDateColumn({ name: "fecha_creacion", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "fecha_actualizacion", type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(() => Categorias, (categoria) => categoria.ticketsRelation)
    @JoinColumn({ name: "categoria_id" })
    categoryRelation: Categorias;

    @ManyToOne(() => Usuarios, (usuario) => usuario.ticketsRelation)
    @JoinColumn({ name: "usuario_id" })
    userRelation: Usuarios;

    @ManyToOne(() => EstadoTickets, (estado) => estado.ticketsRelation)
    @JoinColumn({ name: "estado_id" })
    statusRelation: EstadoTickets;

    @ManyToOne(() => Prioridad, (prioridad) => prioridad.ticketsRelation)
    @JoinColumn({ name: "prioridad_id" })
    priorityRelation: Prioridad;

    @OneToMany(() => Comentarios, (comentarios) => comentarios.ticketsRelation)
    commentRelation: Comentarios[];

    // relacion con encuestas
    @OneToMany(() => EncuestasSatisfaccion, (encuestas) => encuestas.ticketRelation)
    surveyRelation: EncuestasSatisfaccion[];

    // relacion con adjuntos
    @OneToMany(() => TicketAttachment, (attachment) => attachment.ticketRelation)
    attachmentsRelation: TicketAttachment[];
}
