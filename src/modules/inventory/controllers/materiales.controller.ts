import { NextFunction, Request, Response } from "express";
import { Material } from "../entities/materiales";
import { validate } from "class-validator";

export async function getAllMaterials(req: Request, res: Response, next: NextFunction){
    try {
        
        const materiales = await Material.find();

        if (!materiales) {
            return res.status(404).json({ message: "No materials found." });
        }

        const formattedMaterials = materiales.map((m) => ({
            id: m.id,
            name: m.name,
        }));

        res.status(200).json(formattedMaterials);

    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {

        const { name } = req.body;

        const exist = await Material.createQueryBuilder("a")
        .where("a.name = :name",{ name: name})
        .getOne();

        if (exist) {
            return res.status(409).json({ message: "Area Dependency alraedy exist" })
        }

        const newArea = await Material.create({
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

        const exist = await Material.findOneBy({ id: parseInt(id as string) });

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