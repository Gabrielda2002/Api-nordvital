import { NextFunction, Request, Response } from "express";


export function validarId(req: Request, res: Response, next: NextFunction){
    const { id } = req.params;

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
        return res.status(400).json({ message: "Id must be a number" });
    }

    req.params.id = parsedId.toString();

    next();
}