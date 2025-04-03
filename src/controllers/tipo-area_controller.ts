import { NextFunction, Request, Response } from "express";
import { TipoArea } from "../entities/tipo-area";

export async function getAllAreaTypes(req: Request, res: Response, next: NextFunction) {
    try {
        const areaTypes = await TipoArea.createQueryBuilder("a")
            .getMany();

        const formattedAreaTypes: { id: number; name: string }[] = areaTypes.map((a) => ({
            id: a.id,
            name: a.nombre,
        }));

        res.status(200).json(formattedAreaTypes);

    } catch (error) {
        next(error);
    }
}