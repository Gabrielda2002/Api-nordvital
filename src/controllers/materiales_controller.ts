import { NextFunction, Request, Response } from "express";
import { Material } from "../entities/materiales";

export async function getAllMaterials(req: Request, res: Response, next: NextFunction){
    try {
        
        const materiales = await Material.find();

        if (!materiales) {
            return res.status(404).json({ message: "No materials found." });
        }

        const formattedMaterials = materiales.map((m) => ({
            id: m.id,
            name: m.nombre,
        }));

        res.status(200).json(formattedMaterials);

    } catch (error) {
        next(error);
    }
}