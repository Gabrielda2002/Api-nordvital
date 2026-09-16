import { NextFunction, Request, Response } from "express";
import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Eventos } from "../entities/eventos";
import { validateEntity } from "@core/utils/validation-helper";
import { NotFoundError } from "@core/utils/custom-errors";
import Logger from "@core/utils/logger-wrapper";

export async function getAllEvents(req: Request, res: Response, next: NextFunction){
    try {
        
        const eventos = await Eventos.find({
            relations: { authorRelation: true }
        });
        return res.json(eventos);

    } catch (error) {
        next(error);
    }
}

export async function getEventById(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const evento = await Eventos.createQueryBuilder("eventos")
        .where("eventos.id = :id", { id })
        .getOne();

        if (!evento) {
            throw new NotFoundError("Event not found");
        }

        return res.json(evento);

    } catch (error) {
        next(error);
    }
}

export async function createEvent(req: Request, res: Response, next: NextFunction){
    try {
        const { title, dateStart, dateEnd, color, description, timeStart, timeEnd, place } = req.body;


        const evento = new Eventos();
        evento.title = title.toUpperCase();
        evento.dateStart = parseISO(dateStart);
        evento.dateEnd = parseISO(dateEnd);
        evento.color = color;
        evento.description = description;
        evento.timeStart = timeStart;
        evento.timeEnd = timeEnd;
        evento.place = place;
        evento.authorId = req.user?.id as number;

        await validateEntity(evento);

        await evento.save();

        Logger.info("Event created", { eventId: evento.id, authorId: evento.authorId });

        return res.status(201).json(evento);

    } catch (error) {
        next(error);
    }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { title, dateStart, dateEnd, color, description, timeStart, timeEnd, place } = req.body;

        const evento = await Eventos.createQueryBuilder("eventos")
        .where("eventos.id = :id", { id })
        .getOne();

        if (!evento) {
            throw new NotFoundError("Event not found");
        }

        const timeZone = "America/Bogota";

        evento.title = title.toUpperCase();
        evento.dateStart = toZonedTime(parseISO(dateStart), timeZone);
        evento.dateEnd = toZonedTime(parseISO(dateEnd), timeZone);
        evento.color = color;
        evento.description = description;
        evento.timeStart = timeStart;
        evento.timeEnd = timeEnd;
        evento.place = place;

        await validateEntity(evento);

        await evento.save();

        Logger.info("Event updated", { eventId: evento.id, authorId: evento.authorId });

        return res.json(evento);

    } catch (error) {
        next(error);
    }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const evento = await Eventos.createQueryBuilder("eventos")
        .where("eventos.id = :id", { id })
        .getOne();

        if (!evento) {
            throw new NotFoundError("Event not found");
        }

        await evento.remove();

        return res.json({ message: "Event deleted" });

    } catch (error) {
        next(error);
    }
}
