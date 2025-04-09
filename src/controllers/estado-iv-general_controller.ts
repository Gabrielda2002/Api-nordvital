import { NextFunction, Request, Response } from "express";
import { EstadoInvGeneral } from "../entities/estado-inv-general";

export async function getAllStatusIVGeneral(req: Request, res: Response, next: NextFunction) {
    try {
        const statusIVGeneral = await EstadoInvGeneral.createQueryBuilder("s")
        .getMany();

        if (!statusIVGeneral) {
            return res.status(404).json({ message: "No status found." });
        }

        const formattedStatusIVGeneral = statusIVGeneral.map((s) => ({
            id: s.id,
            name: s.name,
        }));

        res.status(200).json(formattedStatusIVGeneral);
    } catch (error) {
        next(error);
    }
}