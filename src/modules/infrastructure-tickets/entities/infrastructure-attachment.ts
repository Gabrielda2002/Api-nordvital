import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { InfrastructureTicket } from "./infrastructure-ticket";

@Entity({ name: "infrastructure_attachments" })
export class InfrastructureAttachment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "ticket_id", type: "int" })
    @IsNotEmpty({ message: "Ticket ID is required" })
    @IsInt()
    ticketId: number;

    @Column({ name: "file_name", type: "varchar", length: 150 })
    @IsNotEmpty({ message: "File name is required" })
    @IsString()
    @Length(1, 150, { message: "File name must be between $constraint1 and $constraint2 characters" })
    fileName: string;

    @Column({ name: "file_url", type: "varchar", length: 200 })
    @IsNotEmpty({ message: "File URL is required" })
    @IsString()
    @Length(1, 200, { message: "File URL must be between $constraint1 and $constraint2 characters" })
    fileUrl: string;

    @Column({ name: "file_size", type: "int" })
    @IsNotEmpty({ message: "File size is required" })
    @IsInt()
    fileSize: number;

    @Column({ name: "mime_type", type: "varchar", length: 100 })
    @IsNotEmpty({ message: "MIME type is required" })
    @IsString()
    @Length(1, 100, { message: "MIME type must be between $constraint1 and $constraint2 characters" })
    mimeType: string;

    @Column({ name: "file_name_saved", type: "varchar", length: 200 })
    @IsNotEmpty({ message: "Saved file name is required" })
    @IsString()
    fileNameSaved: string;

    @Column({ name: "uploaded_by_user_id", type: "int" })
    @IsNotEmpty({ message: "Uploader user ID is required" })
    @IsInt()
    uploadedByUserId: number;

    @Column({
        name: "attachment_type",
        type: "enum",
        enum: ["photo", "document", "pdf", "video", "other"],
        default: "other",
    })
    @IsNotEmpty({ message: "Attachment type is required" })
    @IsString()
    attachmentType: string;

    @Column({ name: "is_internal", type: "tinyint", width: 1, default: 0 })
    isInternal: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => InfrastructureTicket, (ticket) => ticket.attachmentsRelation)
    @JoinColumn({ name: "ticket_id" })
    ticketRelation: InfrastructureTicket;

    @ManyToOne(() => Usuarios, (usuario) => usuario.infrastructureAttachmentsRelation)
    @JoinColumn({ name: "uploaded_by_user_id" })
    uploaderRelation: Usuarios;
}
