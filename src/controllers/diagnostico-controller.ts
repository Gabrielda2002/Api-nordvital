import { NextFunction, Request, Response } from "express";
import { Diagnostico } from "../entities/diagnostico";
import { validate } from "class-validator";

export async function getAllDiagnosticos(req: Request, res: Response, next: NextFunction) {
    try {
        
        const diagnosticos = await Diagnostico.find()

        if (diagnosticos.length === 0) {
            return res.status(404).json({message: "No se encontraron diagnosticos"});
        }

        return res.json(diagnosticos);

    } catch (error) {
        next(error);
    }
}

export async function getDiagnosticoById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const diagnostico = await Diagnostico.findOneBy({id: parseInt(id)});

        if (!diagnostico) {
            return res.status(404).json({message: "Diagnostico not found"});
        }

        return res.json(diagnostico);

    } catch (error) {
        next(error);
    }
}

export async function createDiagnostico(req: Request, res: Response, next: NextFunction) {
    try {
        const { code, description } = req.body;

        if (!code || !description) {
            return res.status(400).json({ message: "Todos los campos son requeridos." });
        }

        const diagnosticoExists = await Diagnostico.findOneBy({ code });

        if (diagnosticoExists) {
            return res.status(409).json({ message: "El diagnóstico ya existe." });
        }

        const diagnostico = Diagnostico.create({
            code,
            description,
        });

        const errors = await validate(diagnostico);

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints,
            }));

            return res.status(400).json({ message: "Error al crear el diagnóstico", errors: errorsMessage });
        }

        await diagnostico.save();

        return res.status(201).json(diagnostico);

    } catch (error) {
        next(error);
    }
}

export async function updateDiagnostico(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }

        const { code, description } = req.body;

        if (!code || !description) {
            return res.status(400).json({message: "All fields are required"});
        }

        const diagnostico = await Diagnostico.findOneBy({id: parseInt(id)});

        if (!diagnostico) {
            return res.status(404).json({message: "Diagnostico not found"});
        }

        diagnostico.code = code;
        diagnostico.description = description;

        const errors = await validate(diagnostico);
        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({message: "Error updating diagnostico", errors: errorsMessage});
            
        }
        await diagnostico.save();

        return res.json(diagnostico);

    } catch (error) {
        next(error);
    }
}

export async function deleteDiagnostico(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }

        const diagnostico = await Diagnostico.findOneBy({id: parseInt(id)});

        if (!diagnostico) {
            return res.status(404).json({message: "Diagnostico not found"});
        }

        await diagnostico.remove();

        return res.json({message: "Diagnostico deleted"});

    } catch (error) {
        next(error);
    }

}