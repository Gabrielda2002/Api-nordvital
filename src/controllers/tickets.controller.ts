import { NextFunction, Request, Response } from "express";
import { Tickets } from "../entities/tickets";
import { NotificationService } from "../services/notification.service";
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

        const ticket = await Tickets.findOneBy({id : parseInt(String(id))});

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
        const { type ,title, description, userId, categoryId, priorityId } = req.body;

        const ticket = new Tickets();
        ticket.type = type;
        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(String(userId));
        ticket.categoryId = parseInt(String(categoryId));
        ticket.statusId = 1;
        ticket.preorityId = parseInt(String(priorityId));

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
        const { type, title, description, userId, categoryId, statusId, preorityId } = req.body;

        const ticket = await Tickets.findOneBy({id : parseInt(String(id))});

        if(!ticket){
            return res.status(404).json({message: "Ticket no encontrado"});
        }

        // verificar si el estado cambio a cerrado
        const oldStatusId = ticket.statusId;

        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(String(userId));
        ticket.categoryId = parseInt(String(categoryId));
        ticket.statusId = parseInt(String(statusId));
        ticket.preorityId = parseInt(String(preorityId));

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

        const ticket = await Tickets.findOneBy({id : parseInt(String(id))});

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
            type: t.type,
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

export async function getListTicketsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        
        const  { id } = req.params;

        const tickets = await Tickets.createQueryBuilder("tickets")
        .select("tickets.id", "id")
        .addSelect("tickets.type", "type")
        .addSelect("tickets.title", "title")
        .addSelect("tickets.description", "description")
        .addSelect("tickets.createdAt", "createdAt")
        .addSelect("tickets.updatedAt", "updatedAt")
        .addSelect("status.name", "status")
        .addSelect("priority.name", "priority")
        .addSelect("category.name", "category")
        .leftJoin("tickets.statusRelation", "status")
        .leftJoin("tickets.priorityRelation", "priority")
        .leftJoin("tickets.categoryRelation", "category")
        .where("tickets.userId = :userId", { userId: parseInt(String(id)) })
        .orderBy("tickets.createdAt", "DESC")
        .getRawMany();

        if (tickets.length === 0) {
            return res.status(404).json({message: "tickets not found"});
        }        

        return res.status(200).json(tickets);

    } catch (error) {
        next(error);
    }
}