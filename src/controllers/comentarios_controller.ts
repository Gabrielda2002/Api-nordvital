import { NextFunction, Request, Response } from "express";
import { Comentarios } from "../entities/comentarios";
import { validate } from "class-validator";

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
    comment.coment = coment;

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
        comment.coment = coment;

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