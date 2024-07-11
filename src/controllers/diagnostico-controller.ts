import { Request, Response } from "express";
import { Diagnostico } from "../entities/diagnostico";

export async function getAllDiagnosticos(req: Request, res: Response) {
    try {
        
        const diagnosticos = await Diagnostico.find()
        return res.json(diagnosticos);

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({message : error.message});
        }
    }
}