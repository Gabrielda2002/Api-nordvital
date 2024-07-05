import { Request, Response } from "express";
import { Convenio } from "../entities/convenio";

export async function getAllConvenio(req: Request, res: Response){
    try {
        
        const convenio = await Convenio.find();
        return res.json(convenio);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}