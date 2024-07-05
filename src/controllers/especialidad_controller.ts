import { Request, Response } from "express";
import { Especialidad } from "../entities/especialidad";

export async function getAllEspecialidades(req: Request, res: Response) {
    try {
        
        const especialidades = await Especialidad.find();
        return res.json(especialidades);

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}