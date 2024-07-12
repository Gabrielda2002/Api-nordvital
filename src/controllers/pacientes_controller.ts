import { Request, Response } from "express";
import { Pacientes } from "../entities/pacientes";

export async function getAllPacientes(req: Request, res: Response){
    try {
        
        const pacientes = await Pacientes.find();
        return res.json(pacientes);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        
    }
}