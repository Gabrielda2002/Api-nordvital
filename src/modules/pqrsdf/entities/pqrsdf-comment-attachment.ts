import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PqrsdfComment } from "./pqrsdf-comment";

@Entity({ name: "pqrsdf_comment_attachments" })
export class PqrsdfCommentAttachment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int", unsigned: true, comment: "Identificador único del adjunto" })
    id: number;

    @Column({ name: "comment_id", type: "int", unsigned: true, comment: "FK a pqrsdf_comments — comentario al que pertenece el adjunto" })
    @IsInt()
    @IsNotEmpty({ message: "El comentario no puede estar vacío" })
    commentId: number;

    @Column({ name: "file_name", type: "varchar", length: 255, comment: "Nombre original del archivo" })
    @IsString()
    @Length(1, 255, { message: "El nombre del archivo debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "El nombre del archivo es requerido" })
    fileName: string;

    @Column({ name: "file_name_saved", type: "varchar", length: 255, comment: "Nombre interno con el que se almacenó el archivo" })
    @IsString()
    @Length(1, 255, { message: "El nombre almacenado del archivo debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "El nombre almacenado del archivo es requerido" })
    fileNameSaved: string;

    @Column({ name: "file_path", type: "varchar", length: 300, comment: "Ruta relativa del archivo dentro de uploads" })
    @IsString()
    @Length(1, 300, { message: "La ruta del archivo debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "La ruta del archivo es requerida" })
    filePath: string;

    @Column({ name: "mime_type", type: "varchar", length: 100, comment: "Tipo MIME del archivo" })
    @IsString()
    @Length(1, 100, { message: "El tipo MIME debe tener entre $constraint1 y $constraint2 caracteres" })
    @IsNotEmpty({ message: "El tipo MIME es requerido" })
    mimeType: string;

    @Column({ name: "file_size", type: "int", comment: "Tamaño del archivo en bytes" })
    @IsInt()
    @IsNotEmpty({ message: "El tamaño del archivo es requerido" })
    fileSize: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    // ? relacion con el comentario
    @ManyToOne(() => PqrsdfComment, (comment) => comment.attachmentsRelation)
    @JoinColumn({ name: "comment_id" })
    commentRelation: PqrsdfComment;
}
