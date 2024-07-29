import { NextFunction, Request, Response } from "express";
import { Radicador } from "../entities/radicador";
import { validate } from "class-validator";

export async function getAllRadicador(req: Request, res: Response, next: NextFunction){
    try {
        
        const radicador = await Radicador.find();
        return res.json(radicador);

    } catch (error) {
        next(error);
    }
}

export async function getRadicador(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;

        const radicador = await Radicador.findOneBy({ id: parseInt(id) });

        if (!radicador) {
            return res.status(404).json({ message: 'Radicador no encontrado' });
        }

        return res.json(radicador);

    } catch (error) {
        next(error);
    }
}

export async function createRadicador(req: Request, res: Response, next: NextFunction){
    try {

        const { name } = req.body;


        const radicacadorExist = await Radicador.findOneBy({ name });

        if (radicacadorExist) {
            return res.status(409).json({ message: 'Radicador ya existe' });
        }

        const radicador =  new Radicador();
        radicador.name = name;
        radicador.status = true;

        const errors = await validate(radicador);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: 'Error creando radicador', messages });
        }

        await radicador.save();

        return res.json(radicador);

    } catch (error) {
        next(error);
    }
}

export async function updateRadicador(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;
        const { name, status } = req.body;

        const radicador = await Radicador.findOneBy({ id: parseInt(id) });

        if (!radicador) {
            return res.status(404).json({ message: 'Radicador no encontrado' });
        }

        radicador.name = name;
        radicador.status = status;

        const errors = await validate(radicador);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: 'Error actualizando radicador', messages });
        }

        await radicador.save();

        return res.json(radicador);

    } catch (error) {
        next(error);
    }
}

export async function deleteRadicador(req: Request, res: Response, next: NextFunction){
    try {

        const { id } = req.params;

        const radicador = await Radicador.findOneBy({ id: parseInt(id) });

        if (!radicador) {
            return res.status(404).json({ message: 'Radicador no encontrado' });
        }

        await radicador.remove();

        return res.json({ message: 'Radicador eliminado' });

    } catch (error) {
        next(error);
    }
}