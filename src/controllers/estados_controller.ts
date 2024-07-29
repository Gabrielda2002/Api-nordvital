import { NextFunction, Request, Response } from "express";
import { Estados } from "../entities/estados";
import { validate } from "class-validator";
import { parse } from "path";

export async function getAllEstados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const estados = await Estados.find();
        return res.json(estados)

    } catch (error) {
        next(error);
    }
}

export async function getEstadosById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const estado = await Estados.findOneBy({ id: parseInt(id) });

        if (!estado) {
            return res.status(404).json({ message: "Estado not found" });
        }

        return res.json(estado);

    } catch (error) {
        next(error);
    }
}

export async function createEstados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const estadoExist = await Estados.findOneBy({ name });

        if (estadoExist) {
            return res.status(400).json({ message: "Estado already exists" });
        }

        const newEstados = new Estados();
        newEstados.name = name;

        const errors = await validate(newEstados);

        if (errors.length > 0) {

            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json(errorsMessage);
        }

        await newEstados.save();

        return res.json(newEstados);

    } catch (error) {
        next(error);
    }
}

export async function updateEstados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { name } = req.body;

        const estado = await Estados.findOneBy({ id: parseInt(id) });

        if (!estado) {
            return res.status(404).json({ message: "Estado not found" });
        }

        estado.name = name;

        const errors = await validate(estado);

        if (errors.length > 0) {

            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json(errorsMessage);
        }

        await estado.save();

        return res.json(estado);

    } catch (error) {
        next(error);
    }
}

export async function deleteEstados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const estado = await Estados.findOneBy({ id: parseInt(id) });

        if (!estado) {
            return res.status(404).json({ message: "Estado not found" });
        }

        await estado.remove();

        return res.json({ message: "Estado removed" });

    } catch (error) {
        next(error);
    }
}
