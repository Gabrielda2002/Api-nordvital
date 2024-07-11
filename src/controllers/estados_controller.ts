import { Request, Response } from "express";
import { Estados } from "../entities/estados";

export async function getAllEstados(req: Request, res: Response) {
    try {
        
        const estados = await Estados.find();
        return res.json(estados)

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }
}