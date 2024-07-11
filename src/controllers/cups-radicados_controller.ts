import { Request, Response } from "express";
import { CupsRadicados } from "../entities/cups-radicados";

export async function getAllCupsRadicados(req: Request, res: Response){
    try {
        
        const cupsRadicados = await CupsRadicados.find();
        return res.json(cupsRadicados);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }
}