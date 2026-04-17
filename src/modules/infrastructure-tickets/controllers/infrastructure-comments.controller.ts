import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { InfrastructureComment } from "../entities/infrastructure-comment";
import { InfrastructureTicket } from "../entities/infrastructure-ticket";
import { NotificationService } from "../../notifications/services/notification.service";

export async function getAllInfrastructureComments(req: Request, res: Response, next: NextFunction) {
    try {
        const comments = await InfrastructureComment.find();
        return res.json(comments);
    } catch (error) {
        next(error);
    }
}

export async function getInfrastructureCommentById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const comment = await InfrastructureComment.findOneBy({ id: parseInt(String(id)) });

        if (!comment) {
            return res.status(404).json({ message: "Infrastructure comment not found" });
        }

        return res.json(comment);
    } catch (error) {
        next(error);
    }
}

export async function createInfrastructureComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketId, userId, comment } = req.body;

        const newComment = new InfrastructureComment();
        newComment.ticketId = parseInt(String(ticketId));
        newComment.userId = parseInt(String(userId));
        newComment.comment = comment;

        const errors = await validate(newComment);
        if (errors.length > 0) {
            const messages = errors.map(e => Object.values(e.constraints || {}).join(", "));
            return res.status(400).json({ message: messages });
        }

        await newComment.save();

        return res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
}

export async function updateInfrastructureComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const existing = await InfrastructureComment.findOneBy({ id: parseInt(String(id)) });
        if (!existing) {
            return res.status(404).json({ message: "Infrastructure comment not found" });
        }

        existing.comment = comment;

        const errors = await validate(existing);
        if (errors.length > 0) {
            const messages = errors.map(e => Object.values(e.constraints || {}).join(", "));
            return res.status(400).json({ message: messages });
        }

        await existing.save();

        return res.json(existing);
    } catch (error) {
        next(error);
    }
}

export async function deleteInfrastructureComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const comment = await InfrastructureComment.findOneBy({ id: parseInt(String(id)) });
        if (!comment) {
            return res.status(404).json({ message: "Infrastructure comment not found" });
        }

        await comment.remove();

        return res.json({ message: "Infrastructure comment deleted" });
    } catch (error) {
        next(error);
    }
}

export async function createInfrastructureCommentAndChangeStatus(req: Request, res: Response, next: NextFunction) {
    const queryRunner = InfrastructureComment.getRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        console.log(req.body)
        const { ticketId, userId, comment, status, quotationAmount } = req.body;

        const newComment = new InfrastructureComment();
        newComment.ticketId = parseInt(String(ticketId));
        newComment.userId = parseInt(String(userId));
        newComment.comment = comment;

        const errors = await validate(newComment);
        if (errors.length > 0) {
            const messages = errors.map(e => Object.values(e.constraints || {}).join(", "));
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ message: messages });
        }

        const ticket = await InfrastructureTicket.findOneBy({ id: parseInt(String(ticketId)) });
        if (!ticket) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: "Infrastructure ticket not found" });
        }

        const oldStatusId = ticket.statusId;
        ticket.statusId = parseInt(String(status));
        ticket.quotationAmount = quotationAmount ? parseFloat(String(quotationAmount)) : ticket.quotationAmount;

        await queryRunner.manager.save(newComment);
        await queryRunner.manager.save(ticket);

        await queryRunner.commitTransaction();

        if (oldStatusId !== 2 && ticket.statusId === 2) {
            await NotificationService.createNotification(
                ticket.userId,
                "Ticket de Infraestructura Actualizado",
                `Se actualizó el estado de tu ticket de infraestructura "${ticket.title}".`,
                ticket.id,
                "update_infrastructure_ticket"
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

export async function getInfrastructureCommentsByTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const comments = await InfrastructureComment.createQueryBuilder("comment")
            .leftJoinAndSelect("comment.userRelation", "user")
            .where("comment.ticketId = :ticketId", { ticketId: parseInt(String(id)) })
            .orderBy("comment.createdAt", "DESC")
            .getMany();

        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this ticket" });
        }

        const formatted = comments.map((c) => ({
            id: c.id,
            comment: c.comment,
            createdAt: c.createdAt,
            userName: c.userRelation?.name || "N/A",
            userLastName: c.userRelation?.lastName || "N/A",
        }));

        return res.json(formatted);
    } catch (error) {
        next(error);
    }
}
