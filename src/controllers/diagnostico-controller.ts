import { Request, Response } from "express";
import { Diagnostico } from "../entities/diagnostico";
import { validate } from "class-validator";

export async function getAllDiagnosticos(req: Request, res: Response) {
    try {
        
        const diagnosticos = await Diagnostico.find()

        if (diagnosticos.length === 0) {
            return res.status(404).json({message: "No se encontraron diagnosticos"});
        }

        return res.json(diagnosticos);

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({message : error.message});
        }
    }
}

export async function getDiagnosticoById(req: Request, res: Response){
    try {
        
        const { id } = req.params;

        const idDiagnostico = parseInt(id);

        if (isNaN(idDiagnostico)) {
            return res.status(400).json({message: "Id must be a number"});
        }

        const diagnostico = await Diagnostico.findOneBy({id: parseInt(id)});

        if (!diagnostico) {
            return res.status(404).json({message: "Diagnostico not found"});
        }

        return res.json(diagnostico);

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(400).json({message: error.message});
        }

        return res.status(500).json({message: "Internal Server Error"});

    }
}

export async function createDiagnostico(req: Request, res: Response) {
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
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function updateDiagnostico(req: Request, res: Response){
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }

        const { code, description } = req.body;

        if (!code || !description) {
            return res.status(400).json({message: "All fields are required"});
        }

        const diagnosticoId = parseInt(id);

        if (isNaN(diagnosticoId)) {
            return res.status(400).json({message: "Id must be a number"});
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
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({message: error.message});
        }

        return res.status(500).json({message: "Internal Server Error"});

    }
}

export async function deleteDiagnostico(req: Request, res: Response){
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: "Id is required"});
        }

        const diagnosticoId = parseInt(id);

        if (isNaN(diagnosticoId)) {
            return res.status(400).json({message: "Id must be a number"});
        }

        const diagnostico = await Diagnostico.findOneBy({id: parseInt(id)});

        if (!diagnostico) {
            return res.status(404).json({message: "Diagnostico not found"});
        }

        await diagnostico.remove();

        return res.json({message: "Diagnostico deleted"});

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({message: error.message});
        }

        return res.status(500).json({message: "Internal Server Error"});

    }

}