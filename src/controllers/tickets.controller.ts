import { NextFunction, Request, Response } from "express";
import { Tickets } from "../entities/tickets";
import { NotificationService } from "../services/notification.service";
import { format, toZonedTime } from "date-fns-tz";
import { TicketAttachment } from "../entities/ticket-attachment";
import path from "path";
import fs from "fs";
import { validate } from "class-validator";
import Logger from "../utils/logger-wrapper";

export async function getAllTickets(req: Request, res: Response, next: NextFunction) {
    try {

        const tickets = await Tickets.find();

        return res.json(tickets);

    } catch (error) {
        next(error);
    }
}

export async function getTicketById(req: Request, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;

        const ticket = await Tickets.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        return res.json(ticket);

    } catch (error) {
        next(error);
    }
}

export async function createTicket(req: Request, res: Response, next: NextFunction) {
    const queryRunner = Tickets.getRepository().manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let uploadedFilePath: string | null = null;

    try {
        const { type, title, description, userId, categoryId, attachmentType } = req.body;
        const file = req.file;

        const ticket = new Tickets();
        ticket.type = type;
        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(String(userId));
        ticket.categoryId = parseInt(String(categoryId));
        ticket.statusId = 1;

        await queryRunner.manager.save(ticket);

        if (file) {
            Logger.info(`Archivo subido: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
            uploadedFilePath = file.path;

            const fileNameWithoutExt = path.basename(
                file.originalname,
                path.extname(file.originalname)
            ).normalize("NFD");

            const ticketAttachmentExist = await queryRunner.manager.findOne(TicketAttachment, {
                where: { fileName: fileNameWithoutExt }
            });

            if (ticketAttachmentExist) {
                await queryRunner.rollbackTransaction();
                
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }
                
                return res.status(400).json({ 
                    message: "Ya existe un archivo con el mismo nombre. Por favor renombra el archivo e intenta nuevamente." 
                });
            }

            const relativePath = `/tickets/${file.filename}`;

            const ticketAttachment = new TicketAttachment();
            ticketAttachment.ticketId = ticket.id;
            ticketAttachment.fileName = fileNameWithoutExt;
            ticketAttachment.fileUrl = relativePath;
            ticketAttachment.mimeType = file.mimetype;
            ticketAttachment.fileSize = file.size;
            ticketAttachment.fileNameSaved = file.filename;
            ticketAttachment.uploadedByUserId = parseInt(String(userId));
            ticketAttachment.attachmentType = attachmentType || "other";

            const errorAttachment = await validate(ticketAttachment);

            if (errorAttachment.length > 0) {
                await queryRunner.rollbackTransaction();
                
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }
                
                const message = errorAttachment.map(e => 
                    Object.values(e.constraints || {}).join(", ")
                ).join(", ");
                
                return res.status(400).json({ message });
            }

            await queryRunner.manager.save(ticketAttachment);
        }

        await queryRunner.commitTransaction();

        await NotificationService.createNotificationForRole(
            [1, 17],
            'Nuevo Ticket Creado',
            `Se ha creado un nuevo ticket: "${title}"`,
            ticket.id,
            "new_ticket"
        );

        return res.json(ticket);

    } catch (error) {
        // Rollback seguro
        try {
            await queryRunner.rollbackTransaction();
        } catch (rollbackError) {
            // Ignorar error si la transacción ya fue cerrada
        }

        // Limpiar archivo si se subió
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            try {
                fs.unlinkSync(uploadedFilePath);
            } catch (unlinkError) {
                // Log pero no detener el flujo
                console.error("Error al eliminar archivo:", unlinkError);
            }
        }

        next(error);
    } finally {
        // Siempre liberar conexión
        if (!queryRunner.isReleased) {
            await queryRunner.release();
        }
    }
}

export async function updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { type, title, description, userId, categoryId, statusId, priorityId } = req.body;

        const ticket = await Tickets.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        // verificar si el estado cambio a cerrado
        const oldStatusId = ticket.statusId;

        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(String(userId));
        ticket.categoryId = parseInt(String(categoryId));
        ticket.statusId = parseInt(String(statusId));
        ticket.priorityId = parseInt(String(priorityId));

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

export async function deleteTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const ticket = await Tickets.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        await ticket.remove();

        return res.json({ message: "Ticket eliminado" });

    } catch (error) {
        next(error);
    }
}

// traer los tickets con la informacion del usuario
export async function getTicketsTable(req: Request, res: Response, next: NextFunction) {
    try {

        const tickets = await Tickets.createQueryBuilder("tickets")
            .leftJoinAndSelect("tickets.statusRelation", "estado-ticket")
            .leftJoinAndSelect("tickets.priorityRelation", "prioridad")
            .leftJoinAndSelect("tickets.categoryRelation", "categoria")
            .leftJoinAndSelect("tickets.userRelation", "usuario")
            .leftJoinAndSelect("usuario.sedeRelation", "sede")
            .leftJoinAndSelect("sede.municipioRelation", "municipio")
            .orderBy("tickets.createdAt", "DESC")
            .getMany();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "tickets not found" });
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

        const { id } = req.params;

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
            return res.status(404).json({ message: "tickets not found" });
        }

        return res.status(200).json(tickets);

    } catch (error) {
        next(error);
    }
}