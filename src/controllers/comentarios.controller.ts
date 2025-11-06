import { NextFunction, query, Request, Response } from "express";
import { Comentarios } from "../entities/comentarios";
import { validate } from "class-validator";
import { Tickets } from "../entities/tickets";
import { NotificationService } from "../services/notification.service";

export async function getAllComments(req: Request, res: Response, next: NextFunction){
    try {
        
        const comments = await Comentarios.find();

        res.json(comments);

    } catch (error) {
        next(error);
    }
}

export async function getCommentById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const comment = await Comentarios.findOneBy({ id: parseInt(id) });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.json(comment);

    } catch (error) {
        next(error);
    }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
    try {
        
    const  { ticketId, usuarioId, coment } = req.body;
    
    const comment = new Comentarios();
    comment.ticketId = ticketId;
    comment.usuarioId = usuarioId;
    comment.comment = coment;

    const errors =  await validate(comment);

    if (errors.length > 0) {
        const messages = errors.map(err => ({
            property: err.property,
            constraints: err.constraints
        }))

        return res.status(400).json({ mesage: 'Error al crear comentario' ,messages });
    }

    await comment.save();

    return res.json(comment);
    
    } catch (error) {
        next(error);
    }
}

export async function updateComment(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { ticketId, usuarioId, coment } = req.body;

        const comment = await Comentarios.findOneBy({ id: parseInt(id) });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.ticketId = ticketId;
        comment.usuarioId = usuarioId;
        comment.comment = coment;

        const erros = await validate(comment);

        if (erros.length > 0) {
            const messages = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ mesage: 'Error al actualizar comentario' ,messages });
        }

        await comment.save();

        return res.json(comment);

    } catch (error) {
        next(error);
    }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const comment = await Comentarios.findOneBy({ id: parseInt(id) });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        await comment.remove();

        return res.json({ message: "Comment deleted" });

    } catch (error) {
        next(error);
    }
}

// crear comentario a ticket y cambiar estado de ticket
export async function createCommentAndChangeTicketStatus(req: Request, res: Response, next: NextFunction){
    const queryRunner = Comentarios.getRepository().manager.connection.createQueryRunner(); 
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        

        const { ticketId, usuarioId, coment, status, remote } = req.body;
        console.log("body", req.body);

        const comment = new Comentarios();
        comment.ticketId = ticketId;
        comment.usuarioId = usuarioId;
        comment.comment = coment;

        const errors =  await validate(comment);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            await queryRunner.rollbackTransaction();

            return res.status(400).json({ mesage: 'Error al crear comentario' ,messages });
        }

        
        const ticket = await Tickets.findOneBy({ id: ticketId });
        
        if (!ticket) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: "Ticket not found" });
        }
        
        const oldStatusId = ticket.statusId;

        ticket.statusId = parseInt(status);
        ticket.remote = remote === 'true';

        await queryRunner.manager.save(comment);
        await queryRunner.manager.save(ticket);

        await queryRunner.commitTransaction();

        // si el estado es cerrado crear notificacion
        if (oldStatusId !== 2) {
            await NotificationService.createTicketClosedNotification(ticket, "Ticket Actualizado");
        }

        return res.json(comment);

    } catch (error) {
        await queryRunner.rollbackTransaction();    
        next(error);
    }finally{
        await queryRunner.release();
    }
}

// find comments by ticket
export async function getCommentsByTicket(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const comments = await Comentarios.createQueryBuilder("comentarios")
            .leftJoinAndSelect("comentarios.ticketsRelation", "tickets")
            .leftJoinAndSelect("comentarios.userRelation", "usuarios")
            .where("comentarios.ticketId = :ticketId", { ticketId: id })
            .orderBy("comentarios.createdAt", "DESC")
            .getMany();

        if (comments.length === 0) {
            return res.status(404).json({ message: "Comments not found" });
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