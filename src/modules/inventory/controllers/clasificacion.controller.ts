import { NextFunction, Request, Response } from "express";
import { Clasificacion } from "../entities/clasificacion";
import { validate } from "class-validator";

export async function getAllClassifications(req: Request, res: Response, next: NextFunction) {
    try {

        const classifications = await Clasificacion.createQueryBuilder("c")
            .getMany();

        const formattedClassifications: { id: number; name: string }[] = classifications.map((c) => ({
            id: c.id,
            name: c.name,
        }));

        res.status(200).json(formattedClassifications);

    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {

        const { name } = req.body;

        const exist = await Clasificacion.createQueryBuilder('c')
            .where("c.name = :name", { name: name })
            .getOne();

        if (exist) {
            return res.status(409).json({   
                message: "Classification already exist"
            })
        }

        const newClassification = await Clasificacion.create({
            name: name
        });

        const errors = await validate(newClassification);

        if (errors.length > 0) {
            const messageError = errors.map(e => (
                Object.values(e.constraints || {}).join(', ')
            ));

            return res.status(400).json({ message: messageError });
        }

        await newClassification.save()

        return res.status(200).json(newClassification);

    } catch (error) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;

        const { name } = req.body;

        const exist = await Clasificacion.createQueryBuilder('c')
            .where("c.id = :id", { id: id })
            .getOne();

        if (!exist) {
            return res.status(404).json({ message: "Classification not found" })
        }

        exist.name = name;

        const errors = await validate(exist);

        if (errors.length > 0) {
            const messageError = errors.map(e => (
                Object.values(e.constraints || {}).join(', ')
            ));

            return res.status(400).json({ message: messageError });
        }

        await exist.save();

        return res.status(200).json(exist);

    } catch (error) {
        next(error)
    }
}