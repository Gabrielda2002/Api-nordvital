import { Request, Response } from "express";
import { LugarRadicacion } from "../entities/lugar-radicacion";

export async function getAllLugaresRadicacion(req: Request, res: Response){
    try {
        const lugaresRadicacion = await LugarRadicacion.find();
        return res.json(lugaresRadicacion);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}