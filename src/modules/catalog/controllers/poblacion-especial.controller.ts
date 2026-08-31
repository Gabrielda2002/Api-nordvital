import { NextFunction, Request, Response } from "express";
import { PoblacionEspecial } from "../entities/poblacion-especial";

export async function getAllSpecialPopulations(req: Request, res: Response, next: NextFunction) {
    try {
        const populations = await PoblacionEspecial.find({
            where: { status: true },
            order: { id: "ASC" },
        });

        return res.json(populations);
    } catch (error) {
        next(error);
    }
}
