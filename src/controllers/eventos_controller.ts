import { NextFunction, Request, Response } from "express";
import { Eventos } from "../entities/eventos";
import { validate } from "class-validator";
import { error } from "console";
import { parseISO, addHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function getAllEvents(req: Request, res: Response, next: NextFunction){
    try {
        
        const eventos = await Eventos.find();
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
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        return res.json(evento);

    } catch (error) {
        next(error);
    }
}

export async function createEvent(req: Request, res: Response, next: NextFunction){
    try {
        const { title, dateStart, dateEnd, color, description } = req.body;

        const timeZone = "America/Bogota";

        const evento = new Eventos();
        evento.title = title.toUpperCase();
        evento.dateStart = toZonedTime(parseISO(dateStart), timeZone); 
        evento.dateEnd = toZonedTime(parseISO(dateEnd), timeZone);
        evento.color = color;
        evento.description = description;

        const errors = await validate(evento);

        if (errors.length > 0) {

            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error creating evento", errors: errorsMessage });
        }

        await evento.save();

        console.log("Fecha original:", dateStart);
        console.log("Fecha guardada:", evento.dateStart);

        return res.json(evento);

    } catch (error) {
        next(error);
    }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { title, dateStart, dateEnd, color, description } = req.body;

        const evento = await Eventos.createQueryBuilder("eventos")
        .where("eventos.id = :id", { id })
        .getOne();

        if (!evento) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        const timeZone = "America/Bogota";

        evento.title = title.toUpperCase();
        evento.dateStart = toZonedTime(parseISO(dateStart), timeZone);
        evento.dateEnd = toZonedTime(parseISO(dateEnd), timeZone);
        evento.color = color;
        evento.description = description;

        const errors = await validate(evento);

        if (errors.length > 0) {

            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating evento", errors: errorsMessage });
        }

        await evento.save();

        console.log("Fecha original:", dateStart);
        console.log("Fecha guardada:", evento.dateStart);

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
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        await evento.remove();

        return res.json({ message: "Evento eliminado" });

    } catch (error) {
        next(error);
    }
}