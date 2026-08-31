import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "../../auth/entities/usuarios";
import { Pqrsdf } from "./pqrsdf";
import { PqrsdfCommentAttachment } from "./pqrsdf-comment-attachment";

@Entity({ name: "pqrsdf_comments" })
export class PqrsdfComment extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id", type: "int", unsigned: true, comment: "Identificador único del comentario" })
    id: number;

    @Column({ name: "pqrsdf_id", type: "int", unsigned: true, comment: "FK a pqrsdf — PQRSDF a la que pertenece el comentario" })
    @IsInt()
    @IsNotEmpty({ message: "La PQRSDF no puede estar vacía" })
    pqrsdfId: number;

    @Column({ name: "author_id", type: "int", comment: "FK a users — usuario que realizó el comentario" })
    @IsInt()
    @IsNotEmpty({ message: "El autor no puede estar vacío" })
    authorId: number;

    @Column({ name: "comment", type: "text", comment: "Contenido del comentario" })
    @IsString()
    @IsNotEmpty({ message: "El comentario no puede estar vacío" })
    comment: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    // ? relacion con la pqrsdf
    @ManyToOne(() => Pqrsdf, (pqrsdf) => pqrsdf.commentsRelation)
    @JoinColumn({ name: "pqrsdf_id" })
    pqrsdfRelation: Pqrsdf;

    // ? relacion con el usuario autor
    @ManyToOne(() => Usuarios, (usuario) => usuario.pqrsdfCommentsRelation, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "author_id" })
    authorRelation: Usuarios | null;

    // ? relacion con el adjunto del comentario (máximo uno por comentario)
    @OneToMany(() => PqrsdfCommentAttachment, (attachment) => attachment.commentRelation)
    attachmentsRelation: PqrsdfCommentAttachment[];
}
