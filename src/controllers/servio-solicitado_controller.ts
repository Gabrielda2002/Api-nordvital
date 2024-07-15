import { Request, Response } from "express";
import { ServiciosSolicitados } from "../entities/servicios-solicitados";

export async function getAllServiciosSolicitados(req: Request, res: Response){

    try {
        
        const serviciosSolicitados = await ServiciosSolicitados.find();
        return res.json(serviciosSolicitados);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }

}