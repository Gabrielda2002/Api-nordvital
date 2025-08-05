import { NextFunction, Request, Response } from "express";
import { Especialidad } from "../entities/especialidad";
import { validate } from "class-validator";

export async function getAllEspecialidades(req: Request, res: Response, next: NextFunction) {
    try {
        
        const especialidades = await Especialidad.find();
        return res.json(especialidades);

    } catch (error) {
        next(error);
    }
}

export async function getEspecialidad(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const especialidad = await Especialidad.findOneBy({ id: parseInt(id) });

        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        return res.json(especialidad);

    } catch (error) {
        next(error);
    }
}

export async function createEspecialidad(req: Request, res: Response, next: NextFunction) {

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
        next(error);
    }

}

export async function updateEspecialidad(req: Request, res: Response, next: NextFunction) {

    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const especialidad = await Especialidad.findOneBy({ id: parseInt(id) });

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
        next(error);
    }
}

export async function deleteEspecialidad(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const especialidad = await Especialidad.findOneBy({ id: parseInt(id) });

        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        await especialidad.remove();

        return res.json({ message: "Especialidad deleted" });

    } catch (error) {
        next(error);
    }
}

export async function getEspecialidadesByName(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        let especialidades;
        
        if (name === "@") {
            especialidades = await Especialidad.createQueryBuilder("especialidad")
                .limit(100)
                .getMany();
            
        }else {
            especialidades = await Especialidad.createQueryBuilder("especialidad")
                .where("especialidad.name LIKE :name", { name: `%${name}%` })
                .getMany();
        }

        if (especialidades.length === 0) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        return res.json(especialidades);

    } catch (error) {
        next(error);
    }
}

// actualizar el estado de especialidad
export async function updateStatusEspecialidad(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { status, name } = req.body;

        const especialidad = await Especialidad.findOneBy({ id: parseInt(id) });

        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad not found" });
        }

        if (name) {
            especialidad.name = name;
        }

        if (status !== undefined && status !== "") {
            especialidad.status = status == "1";
        }

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
        next(error);
    }
}