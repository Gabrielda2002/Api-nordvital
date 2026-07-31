import { NextFunction, Request, Response } from "express";
import { AreaPqrs } from "../entities/area-pqrs";

export async function getAllPqrsAreas(req: Request, res: Response, next: NextFunction) {
    try {
        const areas = await AreaPqrs.find({
            where: { status: true },
            order: { id: "ASC" },
        });

        return res.json(areas);
    } catch (error) {
        next(error);
    }
}
