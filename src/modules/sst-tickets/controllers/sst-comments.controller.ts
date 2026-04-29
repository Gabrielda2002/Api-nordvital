import { NextFunction, Request, Response } from "express";
import { validateEntity } from "@core/utils/validation-helper";
import { SstComment } from "../entities/sst-comment";
import { SstTicket } from "../entities/sst-ticket";
import { NotificationService } from "../../notifications/services/notification.service";

export async function getAllSstComments(req: Request, res: Response, next: NextFunction) {
    try {
        const comments = await SstComment.find();
        return res.json(comments);
    } catch (error) {
        next(error);
    }
}

export async function getSstCommentById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const comment = await SstComment.findOneBy({ id: parseInt(String(id)) });

        if (!comment) {
            return res.status(404).json({ message: "SST comment not found" });
        }

        return res.json(comment);
    } catch (error) {
        next(error);
    }
}

export async function getCommentsByTicketId(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;


        const comments = await SstComment.createQueryBuilder("comment")
            .leftJoinAndSelect("comment.userRelation", "user")
            .where("comment.ticketId = :ticketId", { ticketId: parseInt(String(id)) })
            .orderBy("comment.createdAt", "DESC")
            .getMany();

        if (comments.length === 0) {
            return res.status(404).json({ message: "No SST comments found for this ticket" });
        }

        const commentsFormatted = comments.map(c => ({
            id: c.id,
            comment: c.comment,
            createdAt: c.createdAt,
            responsable: c.userRelation?.name,
            lastName: c.userRelation?.lastName,
        }));

        return res.json(commentsFormatted);
    } catch (error) {
        next(error);
    }
}

export async function createSstComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketId, userId, comment } = req.body;

        const newComment = new SstComment();
        newComment.ticketId = parseInt(String(ticketId));
        newComment.userId = parseInt(String(userId));
        newComment.comment = comment;

        await validateEntity(newComment);
        await newComment.save();

        return res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
}

export async function updateSstComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const existing = await SstComment.findOneBy({ id: parseInt(String(id)) });
        if (!existing) {
            return res.status(404).json({ message: "SST comment not found" });
        }

        existing.comment = comment;

        await validateEntity(existing);
        await existing.save();

        return res.json(existing);
    } catch (error) {
        next(error);
    }
}

export async function deleteSstComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const comment = await SstComment.findOneBy({ id: parseInt(String(id)) });
        if (!comment) {
            return res.status(404).json({ message: "SST comment not found" });
        }

        await comment.remove();

        return res.json({ message: "SST comment deleted" });
    } catch (error) {
        next(error);
    }
}

export async function createSstCommentAndChangeStatus(req: Request, res: Response, next: NextFunction) {
    const queryRunner = SstComment.getRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const { ticketId, userId, comment, status } = req.body;

        const newComment = new SstComment();
        newComment.ticketId = parseInt(String(ticketId));
        newComment.userId = parseInt(String(userId));
        newComment.comment = comment;

        await validateEntity(newComment);

        const ticket = await SstTicket.findOneBy({ id: parseInt(String(ticketId)) });
        if (!ticket) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: "SST ticket not found" });
        }

        const oldStatusId = ticket.statusId;
        ticket.statusId = parseInt(String(status));

        await queryRunner.manager.save(newComment);
        await queryRunner.manager.save(ticket);

        await queryRunner.commitTransaction();

        if (oldStatusId !== 2 && ticket.statusId === 2) {
            await NotificationService.createNotification(
                ticket.userId,
                "Ticket de SST Actualizado",
                `Se actualizó el estado de tu ticket de Salud y Seguridad del Trabajo "${ticket.title}".`,
                ticket.id,
                "update_sst_ticket"
            );
        }

        return res.json(newComment);
    } catch (error) {
        await queryRunner.rollbackTransaction();
        next(error);
    } finally {
        await queryRunner.release();
    }
}
