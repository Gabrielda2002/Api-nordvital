import { Request, Response } from "express";
import { Especialidad } from "../entities/especialidad";
import { validate } from "class-validator";

export async function getAllEspecialidades(req: Request, res: Response) {
    try {
        
        const especialidades = await Especialidad.find();
        return res.json(especialidades);

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export async function getEspecialidad(req: Request, res: Response) {
    try {
        
        const { id } = req.params;

        const especialidadId = parseInt(id);

        if (isNaN(especialidadId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const especialidad = await Especialidad.findOneBy({ id: especialidadId });

        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        return res.json(especialidad);

    } catch (error) {
        
        console.log(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export async function createEspecialidad(req: Request, res: Response){

    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const especialidadExist = await Especialidad.findOneBy({ name });

        if (especialidadExist) {
            return res.status(400).json({ message: "Especialidad already exists" });
        }


        const especialidad = new Especialidad();
        especialidad.name = name;
        especialidad.status = true;


        const errors = await validate(especialidad);

        if (errors.length > 0) {

            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ message: "Error creating especialidad", errors: errorsMessage });
            
        }


        await especialidad.save();

        return res.status(201).json(especialidad);

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }

}

export async function updateEspecialidad(req: Request, res: Response){

    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const especialidadId = parseInt(id);

        if (isNaN(especialidadId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const especialidad = await Especialidad.findOneBy({ id: especialidadId });

        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        especialidad.name = name;
        especialidad.status = status

        const errors = await validate(especialidad);
        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ message: "Error updating especialidad", errors: errorsMessage });
            
        }
        await especialidad.save();

        return res.json(especialidad);

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function deleteEspecialidad(req: Request, res: Response){
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const especialidadId = parseInt(id);

        if (isNaN(especialidadId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const especialidad = await Especialidad.findOneBy({ id: especialidadId });

        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        await especialidad.remove();

        return res.json({ message: "Especialidad deleted" });

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}