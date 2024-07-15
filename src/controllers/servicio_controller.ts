import { Request, Response } from "express";
import { Servicios } from "../entities/servicios";

export async function getAllServicios(req: Request, res: Response){
    try {
        
        const servicios = await Servicios.find();
        return res.json(servicios);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
            
        }
        
    }
}