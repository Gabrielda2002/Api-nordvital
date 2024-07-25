import { Request, Response } from "express";
import { LugarRadicacion } from "../entities/lugar-radicacion";
import { validate } from "class-validator";

export async function getAllLugaresRadicacion(req: Request, res: Response){
    try {
        const lugaresRadicacion = await LugarRadicacion.find();
        return res.json(lugaresRadicacion);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export async function getLugarRadicacion(req: Request, res: Response){
    try {
        const { id } = req.params;

        const lugarRadicacionId = parseInt(id);

        if (isNaN(lugarRadicacionId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: lugarRadicacionId });

        if (!lugarRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
        }

        return res.json(lugarRadicacion);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createLugarRadicacion(req: Request, res: Response){
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const lugarRadicacionExist = await LugarRadicacion.findOneBy({ name });

        if (lugarRadicacionExist) {
            return res.status(400).json({ message: "LugarRadicacion already exists" });
        }

        const lugarRadicacion = new LugarRadicacion();
        lugarRadicacion.name = name;
        lugarRadicacion.status = true;

        const errors = await validate(lugarRadicacion);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
        }

        await lugarRadicacion.save();

        return res.json(lugarRadicacion);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateLugarRadicacion(req: Request, res: Response){
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const lugarRadicacionId = parseInt(id);

        if (isNaN(lugarRadicacionId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: lugarRadicacionId });

        if (!lugarRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
        }

        lugarRadicacion.name = name;
        lugarRadicacion.status = status;

        const errors = await validate(lugarRadicacion);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating lugar radicador", messages });

        }

        await lugarRadicacion.save();

        return res.json(lugarRadicacion);

    } catch (error) {
        
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });

    }
}

export async function deleteLugarRadicacion(req: Request, res: Response){
    try {
        const { id } = req.params;

        const lugarRadicacionId = parseInt(id);

        if (isNaN(lugarRadicacionId)) {
            return res.status(400).json({ message: "Id must be a number" });
        }

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: lugarRadicacionId });

        if (!lugarRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
        }

        await lugarRadicacion.remove();

        return res.json({ message: "LugarRadicacion deleted" });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}