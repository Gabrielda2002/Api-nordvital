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

        const diagnosticoExists = await Diagnostico.findOneBy({ code });

        if (diagnosticoExists) {
            return res.status(409).json({ message: "El diagnóstico ya existe." });
        }

        const diagnostico = new  Diagnostico()
        diagnostico.code = code;
        diagnostico.description = description.trim().toUpperCase();

        const errors = await validate(diagnostico);

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => (
                Object.values(err.constraints || {}).join(", ")
            ));

            return res.status(400).json({ message: errorsMessage });
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

        const { description } = req.body;

        const diagnostico = await Diagnostico.findOneBy({id: parseInt(id)});

        if (!diagnostico) {
            return res.status(404).json({message: "Diagnostico not found"});
        }

        diagnostico.description = description.trim().toUpperCase();

        const errors = await validate(diagnostico);
        if (errors.length > 0) {
            const errorsMessage = errors.map(err => (
                Object.values(err.constraints || {}).join(", ")
            ));

            return res.status(400).json({message: errorsMessage});
            
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

export async function getDiagnosticosByName(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { code } = req.body;

        const diagnosticos = await Diagnostico.createQueryBuilder("diagnostico")
            .where("diagnostico.code = :code", {code})
            .getMany();

        if (diagnosticos.length === 0) {
            return res.status(404).json({message: "No diagnosticos found"});
        }

        return res.json(diagnosticos);

    } catch (error) {
        next(error);
    }

}

