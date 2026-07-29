import { NextFunction, Request, Response } from "express";
import { ServicioAtencion } from "../entities/servicio-atencion";

export async function getAllAttentionServices(req: Request, res: Response, next: NextFunction) {
    try {
        const services = await ServicioAtencion.find({
            where: { status: true },
            order: { id: "ASC" },
        });

        return res.json(services);
    } catch (error) {
        next(error);
    }
}
