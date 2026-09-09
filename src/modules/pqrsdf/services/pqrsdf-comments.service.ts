import { DataSource } from "typeorm";
import fs from "fs";
import { AppDataSource } from "@core/db/conexion";
import { PqrsdfComment } from "../entities/pqrsdf-comment";
import { PqrsdfCommentAttachment } from "../entities/pqrsdf-comment-attachment";
import { Pqrsdf } from "../entities/pqrsdf";
import { NotFoundError } from "@core/utils/custom-errors";

export type CreatePqrsdfCommentInput = {
    pqrsdfId: number;
    authorId: number;
    comment: string;
    file?: Express.Multer.File;
};

export class PqrsdfCommentService {
    constructor(private readonly ds: DataSource = AppDataSource) { }

    async create(data: CreatePqrsdfCommentInput): Promise<PqrsdfComment> {
        const pqrsdfExists = await this.ds.getRepository(Pqrsdf).existsBy({ id: data.pqrsdfId });
        
        if (!pqrsdfExists) {
            throw new NotFoundError("PQRSDF no encontrada");
        }

        let savedComment: PqrsdfComment;

        try {
            savedComment = await this.ds.transaction(async (manager) => {
                const commentRepo = manager.getRepository(PqrsdfComment);

                const comment = commentRepo.create({
                    pqrsdfId: data.pqrsdfId,
                    authorId: data.authorId,
                    comment: data.comment,
                } as PqrsdfComment);

                const saved = await commentRepo.save(comment);

                if (data.file) {
                    const attachmentRepo = manager.getRepository(PqrsdfCommentAttachment);
                    await attachmentRepo.save(
                        attachmentRepo.create({
                            commentId: saved.id,
                            fileName: data.file.originalname,
                            fileNameSaved: data.file.filename,
                            filePath: `/PqrsdfComments/${data.file.filename}`,
                            mimeType: data.file.mimetype,
                            fileSize: data.file.size,
                        } as PqrsdfCommentAttachment),
                    );
                }

                return saved;
            });
        } catch (error) {
            // Limpiar el archivo físico si la transacción falló
            if (data.file?.path && fs.existsSync(data.file.path)) {
                fs.unlinkSync(data.file.path);
            }
            throw error;
        }

        const result = await this.ds.getRepository(PqrsdfComment).findOne({
            where: { id: savedComment.id },
            relations: {
                authorRelation: true,
                attachmentsRelation: true,
            },
        });

        if (!result) {
            throw new NotFoundError("Comentario no encontrado después de crearlo");
        }

        return result;
    }

    async findAllByPqrsdf(pqrsdfId: number): Promise<PqrsdfComment[]> {
        const pqrsdfExists = await this.ds.getRepository(Pqrsdf).existsBy({ id: pqrsdfId });
        if (!pqrsdfExists) {
            throw new NotFoundError("PQRSDF no encontrada");
        }

        return this.ds.getRepository(PqrsdfComment)
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.authorRelation", "author")
            .leftJoinAndSelect("author.positionRelation", "position")
            .leftJoinAndSelect("comment.attachmentsRelation", "attachment")
            .where("comment.pqrsdfId = :pqrsdfId", { pqrsdfId })
            .orderBy("comment.createdAt", "ASC")
            .getMany();
    }

    async getAttachment(attachmentId: number): Promise<PqrsdfCommentAttachment> {
        const attachment = await this.ds.getRepository(PqrsdfCommentAttachment).findOne({
            where: { id: attachmentId },
            relations: { commentRelation: true },
        });

        if (!attachment) {
            throw new NotFoundError("Adjunto no encontrado");
        }

        return attachment;
    }
}