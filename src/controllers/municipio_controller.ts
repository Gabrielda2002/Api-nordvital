import { Request, Response } from "express";
import { Municipio } from "../entities/municipio";

export async function getAllMunicipios(req: Request, res: Response) {
    try {
        
        const municipios = await Municipio.find();
        return res.json(municipios);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}