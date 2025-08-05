import { NextFunction, Request, Response } from "express";
import { AreaDependencia } from "../entities/area-dependencia";

export async function getAllAreaDependency(req: Request, res: Response, next: NextFunction){
    try {
        
        const areaDependencia = await AreaDependencia.find();
        
        if (areaDependencia.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros." });
        }

        const areaDependenciaFormated =  areaDependencia.map((i) => ({
            id: i.id,
            name: i.name,
        }));

        res.status(200).json(areaDependenciaFormated);

    } catch (error) {
        next(error);
    }
}