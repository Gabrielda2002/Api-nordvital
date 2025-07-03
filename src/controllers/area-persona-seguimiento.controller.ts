import { NextFunction, Request, Response } from "express";
import { AreaPersonaSeguimiento } from "../entities/area-persona-seguimiento";

export const getAllAreaPerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const areaPerson = await AreaPersonaSeguimiento.find();

        if (!areaPerson || areaPerson.length === 0) {
            return res.status(404).json({ message: "Area Person not found" });
        }

        res.status(200).json(areaPerson);

    } catch (error) {
        next(error);
    }
}

export const getAreaPersonByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { name } = req.body;

        let areaPerson;
        
        if (name === "@") {
            areaPerson = await AreaPersonaSeguimiento.createQueryBuilder("area")
            .limit(100)
            .getMany();
        }else{
            areaPerson = await AreaPersonaSeguimiento.createQueryBuilder("area")
            .where("area.name LIKE :name", { name: `%${name}%` })
        .getMany();
        }

        if (!areaPerson || areaPerson.length === 0) {
            return res.status(404).json({ message: "Area Person not found" });
        }

        res.status(200).json(areaPerson);

    } catch (error) {
        next(error);
    }
}