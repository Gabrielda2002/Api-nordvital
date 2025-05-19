import { NextFunction, Request, Response } from "express";
import { Tickets } from "../entities/tickets";
import { NotificationService } from "../services/notificationService";
import { format, toZonedTime } from "date-fns-tz";

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
        const { title, description, userId, categoryId, priorityId } = req.body;

        // buscar si el usuario tiene tickets
        const userTicketsExist = await Tickets.createQueryBuilder("tickets")
        .leftJoinAndSelect("tickets.userRelation", "user")
        .where("user.id = :userId", { userId })
        .andWhere("tickets.statusId = 1")
        .getOne();

        if (userTicketsExist) {
            return res.status(409).json({message: "El usuario ya tiene un ticket"});
        }

        const ticket = new Tickets();
        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(userId);
        ticket.categoryId = parseInt(categoryId);
        ticket.statusId = 1;
        ticket.preorityId = parseInt(priorityId);

        await ticket.save();

        await NotificationService.createNotificationForRole(
            [1,17],
            'Nuevo Ticket Creado',
            `Se ha creado un nuevo ticket: "${title}"`,
            ticket.id,
            "new_ticket"
        )

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

        // verificar si el estado cambio a cerrado
        const oldStatusId = ticket.statusId;

        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(userId);
        ticket.categoryId = parseInt(categoryId);
        ticket.statusId = parseInt(statusId);
        ticket.preorityId = parseInt(preorityId);

        await ticket.save();

        // // si el estado cambio a cerrado, crear notificacion
        // if (oldStatusId !== 2 && ticket.statusId === 2) {
        //     await NotificationService.createTicketClosedNotification(ticket);
        // }

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

// traer los tickets con la informacion del usuario
export async function getTicketsTable(req: Request, res: Response, next: NextFunction){
    try {
        
        const tickets = await Tickets.createQueryBuilder("tickets")
        .leftJoinAndSelect("tickets.statusRelation", "estado-ticket")
        .leftJoinAndSelect("tickets.priorityRelation", "prioridad")
        .leftJoinAndSelect("tickets.categoryRelation", "categoria" )
        .leftJoinAndSelect("tickets.userRelation", "usuario")
        .leftJoinAndSelect("usuario.sedeRelation", "sede")
        .leftJoinAndSelect("sede.municipioRelation", "municipio")
        .orderBy("tickets.createdAt", "DESC")
        .getMany();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({message: "tickets not found"});
        }

        const timeZone = "America/Bogota";

        const ticketsFormat = tickets.map(t => {
     
            const zonedDate = t.createdAt 
                ? toZonedTime(t.createdAt, timeZone)
                : null;

            const zonedDateUpdated = t.updatedAt
                ? toZonedTime(t.updatedAt, timeZone)
                : null;

            return {
            id: t.id,
            title: t.title,
            description: t.description,
            nameRequester: t.userRelation?.name || 'N/A',
            lastNameRequester: t.userRelation?.lastName || 'N/A',
            category: t.categoryRelation?.name || 'N/A',
            priority: t.priorityRelation?.name || 'N/A',
            status: t.statusRelation?.name || 'N/A',
            headquarter: t.userRelation?.sedeRelation?.name || 'N/A',
            municipio: t.userRelation?.sedeRelation?.municipioRelation?.name || 'N/A',
            phone: t.userRelation?.phoneNumber || 'N/A',
            createdAt: zonedDate ? format(zonedDate, "yyyy-MM-dd HH:mm", { timeZone }) : "N/A",
            updatedAt: zonedDateUpdated ? format(zonedDateUpdated, "yyyy-MM-dd HH:mm", { timeZone }) : "N/A",
        }
    });


        return res.json(ticketsFormat);
    } catch (error) {
        next(error);
    }
}

// validar que el  usuario no tenga tickets abiertos
export async function validateUserTickets(req: Request, res: Response, next: NextFunction){
    try {
        const { userId } = req.params;

        // buscar si el usuario tiene tickets
        const userTicketsExist = await Tickets.createQueryBuilder("tickets")
        .leftJoinAndSelect("tickets.userRelation", "user")
        .where("user.id = :userId", { userId })
        .andWhere("tickets.statusId = 1")
        .getOne();

        if (userTicketsExist) {
            return res.status(200).json({message: "El usuario ya tiene un ticket", have : true});
        }

        return res.json({message: "El usuario no tiene tickets", have : false});
    } catch (error) {
        next(error);
    }
}