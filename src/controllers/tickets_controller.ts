import { NextFunction, Request, Response } from "express";
import { Tickets } from "../entities/tickets";

export async function getAllTickets(req: Request, res: Response, next: NextFunction){
    try {
        
        const tickets = await Tickets.find();

        return res.json(tickets);

    } catch (error) {
        next(error);
    }
}

export async function getTicketById(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;

        const ticket = await Tickets.findOneBy({id : parseInt(id)});

        if(!ticket){
            return res.status(404).json({message: "Ticket no encontrado"});
        }

        return res.json(ticket);

    } catch (error) {
        next(error);
    }
}

export async function createTicket(req: Request, res: Response, next: NextFunction){
    try {
        const { title, description, userId, categoryId, statusId, preorityId } = req.body;

        // buscar si el usuario tiene tickets
        const userTicketsExist = await Tickets.createQueryBuilder("tickets")
        .leftJoinAndSelect("tickets.userRelation", "user")
        .where("user.id = :userId", { userId })
        .getOne();

        if (userTicketsExist) {
            return res.status(409).json({message: "El usuario ya tiene un ticket"});
        }

        const ticket = new Tickets();
        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(userId);
        ticket.categoryId = parseInt(categoryId);
        ticket.statusId = parseInt(statusId);
        ticket.preorityId = parseInt(preorityId);

        await ticket.save();

        return res.json(ticket);

    } catch (error) {
        next(error);
    }
}

export async function updateTicket(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { title, description, userId, categoryId, statusId, preorityId } = req.body;

        const ticket = await Tickets.findOneBy({id : parseInt(id)});

        if(!ticket){
            return res.status(404).json({message: "Ticket no encontrado"});
        }

        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(userId);
        ticket.categoryId = parseInt(categoryId);
        ticket.statusId = parseInt(statusId);
        ticket.preorityId = parseInt(preorityId);

        await ticket.save();

        return res.json(ticket);

    } catch (error) {
        next(error);
    }
}

export async function deleteTicket(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const ticket = await Tickets.findOneBy({id : parseInt(id)});

        if(!ticket){
            return res.status(404).json({message: "Ticket no encontrado"});
        }

        await ticket.remove();

        return res.json({message: "Ticket eliminado"});

    } catch (error) {
        next(error);
    }
}