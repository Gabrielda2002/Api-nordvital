import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tickets } from "./tickets";
import { Usuarios } from "../../auth/entities/usuarios";

@Entity("ticket_attachments")
export class TicketAttachment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "ticket_id" })
    @IsInt()
    @IsNotEmpty({ message: "El ID del ticket es requerido" })
    ticketId: number;

    @Column({ name: "file_name", length: 150 })
    @IsString()
    @Length(1, 150, { message: "El nombre del archivo debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "El nombre del archivo es requerido" })
    fileName: string;

    @Column({ name: "file_url", length: 200 })
    @IsString()
    @Length(1, 200, { message: "La URL del archivo debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "La URL del archivo es requerida" })
    fileUrl: string;

    @Column({ name: "file_size" })
    @IsInt()
    @IsNotEmpty({ message: "El tamaño del archivo es requerido" })
    fileSize: number;

    @Column({ name: "mime_type", length: 100 })
    @IsString()
    @Length(1, 100, { message: "El tipo MIME debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "El tipo MIME es requerido" })
    mimeType: string;

    @Column({ name: "file_name_saved", length: 200 })
    @IsString()
    @IsNotEmpty({ message: "El nombre guardado del archivo es requerido" })
    fileNameSaved: string;

    @Column({ name: "uploaded_by_user_id" })
    @IsInt()
    @IsNotEmpty({ message: "El ID del usuario que subió el archivo es requerido" })
    uploadedByUserId: number;

    @Column({ 
        name: "attachment_type", 
        type: "enum", 
        enum: ["screenshot", "log", "document", "pdf", "video", "other"], 
        default: "other" 
    })
    @IsString()
    @IsNotEmpty({ message: "El tipo de adjunto es requerido" })
    attachmentType: string;

    @Column({ name: "is_internal", type: "tinyint", width: 1, default: 0 })
    isInternal: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    //* Relaciones

    @ManyToOne(() => Tickets, ticket => ticket.attachmentsRelation)
    @JoinColumn({ name: "ticket_id" })
    ticketRelation: Tickets;

    @ManyToOne(() => Usuarios, user => user.ticketAttachmentsRelation)
    @JoinColumn({ name: "uploaded_by_user_id" })
    uploaderRelation: Usuarios;
}
