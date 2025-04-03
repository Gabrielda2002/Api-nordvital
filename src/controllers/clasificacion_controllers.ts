import { NextFunction, Request, Response } from "express";
import { Clasificacion } from "../entities/clasificacion";

export async function getAllClassifications(req: Request, res: Response, next: NextFunction){
    try {
        
        const classifications = await Clasificacion.createQueryBuilder("c")
        .getMany();

        const formattedClassifications: { id: number; name: string }[] = classifications.map((c) => ({
            id: c.id,
            name: c.nombre,
        }));

        res.status(200).json(formattedClassifications);

    } catch (error) {
        next(error);
    }
}