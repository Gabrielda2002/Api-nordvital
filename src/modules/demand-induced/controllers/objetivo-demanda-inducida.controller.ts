import { NextFunction, Request, Response } from "express";
import { ObjetivoDemandaInducida } from "../entities/objetivo-demanda-inducida";
import { buildContainsPattern } from "@core/utils/search-helper";

export const getAllObjetiveDemandInduced = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const objetiveDemandInduced = await ObjetivoDemandaInducida.find();

        if (!objetiveDemandInduced || objetiveDemandInduced.length === 0) {
            return res.status(404).json({ message: "Objetive demand induced not found" });
        }

        return res.status(200).json(objetiveDemandInduced);
    } catch (error) {
        next(error);
    }
}

export const getObjetiveDemandInducedByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { name } = req.body;

        let objetiveDemandInduced;
        if (name === "@") {
            objetiveDemandInduced = await ObjetivoDemandaInducida.createQueryBuilder("objetivoDemandaInducida")
            .limit(100)
            .getMany(); 
        }else {
            objetiveDemandInduced =  await ObjetivoDemandaInducida.createQueryBuilder("objetivoDemandaInducida")
            .where("objetivoDemandaInducida.name LIKE :name ESCAPE '!'", { name: buildContainsPattern(name) })
            .getMany();
        }

        if (!objetiveDemandInduced || objetiveDemandInduced.length === 0) {
            return res.status(404).json({ message: "Objetive demand induced not found" });
        }

        return res.status(200).json(objetiveDemandInduced);

    } catch (error) {
        next(error);
    }
}