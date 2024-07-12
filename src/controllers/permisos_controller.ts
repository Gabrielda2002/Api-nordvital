import { Request, Response } from "express";
import { Permisos } from "../entities/permisos";

export async function getAllPermisos(req: Request, res: Response) {

    try {
        
        const permisos = await Permisos.find();
        return res.json(permisos);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }   
    }

}