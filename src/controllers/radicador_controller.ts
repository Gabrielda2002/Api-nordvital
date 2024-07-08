import { Request, Response } from "express";
import { Radicador } from "../entities/radicador";

export async function getAllRadicador(req: Request, res: Response){
    try {
        
        const radicador = await Radicador.find();
        return res.json(radicador);

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        }
    }
}