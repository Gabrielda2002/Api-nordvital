import { NextFunction, Request, Response } from "express";
import { EstadoTickets } from "../entities/estado-tickets";

export async function getAllStatusTickets(req: Request, res: Response, next: NextFunction){
    try {
        
        const estadosTickets = await EstadoTickets.find();
        return res.json(estadosTickets);

    } catch (error) {
        next(error);
        
    }
}

export async function getStatusTicketById(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;

        const estadoTicket = await EstadoTickets.findOneBy({id : parseInt(id)});

        if(!estadoTicket){
            return res.status(404).json({message: "Estado de ticket no encontrado"});
        }

        return res.json(estadoTicket);

    } catch (error) {
        next(error);
    }
}

export async function createStatusTicket(req: Request, res: Response, next: NextFunction){
    try {
        const { name } = req.body;

        const estadoTicket = new EstadoTickets();
        estadoTicket.name = name;

        await estadoTicket.save();

        return res.json(estadoTicket);

    } catch (error) {
        next(error);
    }
}

export async function updateStatusTicket(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const { name } = req.body;

        const estadoTicket = await EstadoTickets.findOneBy({id : parseInt(id)});

        if(!estadoTicket){
            return res.status(404).json({message: "Estado de ticket no encontrado"});
        }

        estadoTicket.name = name;

        await estadoTicket.save();

        return res.json(estadoTicket);

    } catch (error) {
        next(error);
    }
}

export async function deleteStatusTicket(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const estadoTicket = await EstadoTickets.findOneBy({id : parseInt(id)});

        if(!estadoTicket){
            return res.status(404).json({message: "Estado de ticket no encontrado"});
        }

        await estadoTicket.remove();

        return res.json({message: "Estado de ticket eliminado"});

    } catch (error) {
        next(error);
    }
}