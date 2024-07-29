import { NextFunction, Request, Response } from "express";
import { Permisos } from "../entities/permisos";
import { validate } from "class-validator";

export async function getAllPermisos(req: Request, res: Response, next: NextFunction) {

    try {
        
        const permisos = await Permisos.find();
        return res.json(permisos);

    } catch (error) {
        next(error);
    }

}

export async function getPermiso(req: Request, res: Response, next: NextFunction) {

    try {
        const { id } = req.params;

        const permiso = await Permisos.findOneBy({ id: parseInt(id) });

        if (!permiso) {
            return res.status(404).json({ message: "Permiso not found" });
        }

        return res.json(permiso);

    } catch (error) {
        next(error);
    }

}

export async function createPermiso(req: Request, res: Response, next: NextFunction) {

    try {
        const { name, description, nameVariable, relatedModule } = req.body;

        if (!name || !description || !relatedModule) {
            return res.status(400).json({ message: "name, description, nameVariable and relatedModule are required" });
        }

        const permisoExist = await Permisos.findOneBy({ name });

        if (permisoExist) {
            return res.status(400).json({ message: "Permiso already exists" });
        }

        const permiso = new Permisos();
        permiso.name = name;
        permiso.description = description;
        permiso.nameVariable = nameVariable;
        permiso.relatedModule = relatedModule;

        const errors = await validate(permiso);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error creating permiso", messages });
        }

        await permiso.save();

        return res.json(permiso);
    } catch (error) {
        next(error);
    }
}

export async function updatePermiso(req: Request, res: Response, next: NextFunction) {

    try {
        
        const { id } = req.params;
        const { name, description, nameVariable, relatedModule } = req.body;

        const permiso = await Permisos.findOneBy({ id: parseInt(id) });

        if (!permiso) {
            return res.status(404).json({ message: "Permiso not found" });
        }

        permiso.name = name;
        permiso.description = description;
        permiso.nameVariable = nameVariable;
        permiso.relatedModule = relatedModule;

        const errors = await validate(permiso);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating permiso", messages });

        }

        await permiso.save();

        return res.json(permiso);

    } catch (error) {
        next(error);
    }
}

export async function deletePermiso(req: Request, res: Response, next: NextFunction) {
    
        try {
            const { id } = req.params;
    
            const permiso = await Permisos.findOneBy({ id: parseInt(id) });
    
            if (!permiso) {
                return res.status(404).json({ message: "Permiso not found" });
            }
    
            await permiso.remove();
    
            return res.json({ message: "Permiso deleted" });
    
        } catch (error) {
            next(error);
        }
}