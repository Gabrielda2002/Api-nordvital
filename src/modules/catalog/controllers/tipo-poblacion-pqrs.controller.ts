import { NextFunction, Request, Response } from "express";
import { TipoPoblacionPqrs } from "../entities/tipo-poblacion-pqrs";

export async function getAllPqrsPopulationTypes(req: Request, res: Response, next: NextFunction) {
    try {
        const types = await TipoPoblacionPqrs.find({
            where: { status: true },
            order: { id: "ASC" },
        });

        return res.json(types);
    } catch (error) {
        next(error);
    }
}
