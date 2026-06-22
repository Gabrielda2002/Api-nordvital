import { NextFunction, Request, Response } from "express";
import { TipoArea } from "../entities/tipo-area";
import { validate } from "class-validator";

export async function getAllAreaTypes(req: Request, res: Response, next: NextFunction) {
    try {
        const areaTypes = await TipoArea.createQueryBuilder("a")
            .getMany();

        const formattedAreaTypes: { id: number; name: string }[] = areaTypes.map((a) => ({
            id: a.id,
            name: a.name,
        }));

        res.status(200).json(formattedAreaTypes);

    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {

        const { name } = req.body;

        const exist = await TipoArea.createQueryBuilder("a")
        .where("a.name = :name",{ name: name})
        .getOne();

        if (exist) {
            return res.status(409).json({ message: "Area Dependency alraedy exist" })
        }

        const newArea = await TipoArea.create({
            name: name
        });

        const errors = await validate(newArea)

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => (
                Object.values(err.constraints || {}).join(", ")
            ));

            return res.status(400).json({ message: errorsMessage });
        }

        await newArea.save();

        return res.status(200).json(newArea);

    } catch (error) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;

        const { name } = req.body;

        const exist = await TipoArea.findOneBy({ id: parseInt(id as string) });

        if (!exist) {
            return res.status(400).json({ message: "Area dependency not found" })
        }

        exist.name = name;

        const errors = await validate(exist)

        if (errors.length > 0) {
            const errorMessage = errors.map(e => (
                Object.values(e.constraints || {}).join(", ")
            ));

            return res.status(400).json({ message: errorMessage })
        }

        await exist.save()

        return res.status(200).json(exist);

    } catch (error) {
        next(error)
    }
}