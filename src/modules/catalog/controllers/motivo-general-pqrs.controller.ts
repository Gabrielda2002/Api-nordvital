import { NextFunction, Request, Response } from "express";
import { MotivoGeneralPqrs } from "../entities/motivo-general-pqrs";

export async function getAllPqrsGeneralReasons(req: Request, res: Response, next: NextFunction) {
    try {
        const reasons = await MotivoGeneralPqrs.find({
            where: { status: true },
            order: { id: "ASC" },
        });

        return res.json(reasons);
    } catch (error) {
        next(error);
    }
}
