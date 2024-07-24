import { Request, Response } from "express";
import { Estados } from "../entities/estados";
import { validate } from "class-validator";

export async function getAllEstados(req: Request, res: Response) {
    try {
        
        const estados = await Estados.find();
        return res.json(estados)

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export async function getEstadosById(req: Request, res: Response) {
    try {
        
        const { id } = req.params;

        const estadoId = parseInt(id);

        if (isNaN(estadoId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const estado = await Estados.findOneBy({ id: estadoId });

        if (!estado) {
            return res.status(404).json({ message: "Estado not found" });
        }

        return res.json(estado);

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createEstados(req: Request, res: Response) {
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
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export async function updateEstados(req: Request, res: Response) {
    try {
        
        const { id } = req.params;
        const { name } = req.body;

        const estadoId = parseInt(id);

        if (isNaN(estadoId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const estado = await Estados.findOneBy({ id: estadoId });

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
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export async function deleteEstados(req: Request, res: Response) {
    try {
        
        const { id } = req.params;

        const estadoId = parseInt(id);

        if (isNaN(estadoId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const estado = await Estados.findOneBy({ id: estadoId });

        if (!estado) {
            return res.status(404).json({ message: "Estado not found" });
        }

        await estado.remove();

        return res.json({ message: "Estado removed" });

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}
