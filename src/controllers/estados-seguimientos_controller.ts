import { Request, Response } from "express";
import { EstadosSeguimiento } from "../entities/estados-seguimiento";

export async function getEstadosSeguimientos(req: Request, res: Response){
    try {
        
        const estadosSeguimientos = await EstadosSeguimiento.find();
        return res.json(estadosSeguimientos);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}