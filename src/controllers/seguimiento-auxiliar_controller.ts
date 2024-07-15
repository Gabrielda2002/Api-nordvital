import { Request, Response } from "express";
import { SeguimietoAuxiliar } from "../entities/seguimiento-auxiliar";

export async function getAllSeguimientosAuxiliares(req: Request, res: Response){
    try {
        
        const seguimientosAuxiliares = await SeguimietoAuxiliar.find();
        return res.json(seguimientosAuxiliares);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
            
        }
    }
}