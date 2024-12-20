import { NextFunction, Request, Response } from "express";
import { NotasTecnicas } from "../entities/notas-tecnicas";
import { validate } from "class-validator";

export async function getAllNotaTecnica(req: Request, res: Response, next: NextFunction){
    try {
        
        const nota = await NotasTecnicas.find();

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function getNotaTecnicaById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const nota = await NotasTecnicas.createQueryBuilder("nota")
            .where("nota.id = :id", { id: parseInt(id) })
            .getMany();

        if (!nota) {
            return res.status(404).json({ message: "Nota tecnica not found" });
        }

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function createNotaTecnica(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { idEps, idService, frecuencyUse, amount, subgroup, group, idSede, rate } = req.body;

        const nota = new NotasTecnicas();
        nota.idEps = parseInt(idEps);
        nota.idService = parseInt(idService);
        nota.frecuencyUse = frecuencyUse;
        nota.amount = parseInt(amount);
        nota.subgroup = subgroup;
        nota.group = group;
        nota.idSede = parseInt(idSede);
        nota.rate = parseInt(rate);

        const errors = await validate(nota);
        if (errors.length > 0) {
            const mesage = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }))
            return res.status(400).json({ message: "Error creating nota tecnica", mesage });
        }

        await nota.save();

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function updateNotaTecnica(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { idEps, idService, frecuencyUse, amount, subgroup, group, idSede, rate } = req.body;

        const nota = await NotasTecnicas.createQueryBuilder("nota")
            .where("nota.id = :id", { id: parseInt(id) })
            .getOne();

        if (!nota) {
            return res.status(404).json({ message: "Nota tecnica not found" });
        }

        nota.idEps = parseInt(idEps);
        nota.idService = parseInt(idService);
        nota.frecuencyUse = frecuencyUse;
        nota.amount = parseInt(amount);
        nota.subgroup = subgroup;
        nota.group = group;
        nota.idSede = parseInt(idSede);
        nota.rate = parseInt(rate);

        const errors = await validate(nota);
        if (errors.length > 0) {
            const mesage = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }))
            return res.status(400).json({ message: "Error updating nota tecnica", mesage });
        }

        await nota.save();

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function deleteNotaTecnica(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const nota = await NotasTecnicas.createQueryBuilder("nota")
            .where("nota.id = :id", { id: parseInt(id) })
            .getOne();

        if (!nota) {
            return res.status(404).json({ message: "Nota tecnica not found" });
        }

        await nota.remove();

        return res.json({ message: "Nota tecnica deleted" });

    } catch (error) {
        next(error);
    }
}