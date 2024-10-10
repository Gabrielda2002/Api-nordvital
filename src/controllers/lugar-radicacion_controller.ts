import { NextFunction, Request, Response } from "express";
import { LugarRadicacion } from "../entities/lugar-radicacion";
import { validate } from "class-validator";
import { parse } from "path";

export async function getAllLugaresRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const lugaresRadicacion = await LugarRadicacion.find();
        return res.json(lugaresRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function getLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: parseInt(id)  });

        if (!lugarRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
        }

        return res.json(lugarRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function createLugarRadicacion(req: Request, res: Response, next: NextFunction){
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

            return res.status(400).json({ message: "Error creating lugar radicador", messages });
        }

        await lugarRadicacion.save();

        return res.json(lugarRadicacion);
    } catch (error) {
        next(error);
    }
}

export async function updateLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { name, status } = req.body;

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: parseInt(id) });

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
        next(error);
    }
}

export async function deleteLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: parseInt(id) });

        if (!lugarRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
        }

        await lugarRadicacion.remove();

        return res.json({ message: "LugarRadicacion deleted" });
    } catch (error) {
        next(error);
    }
}

export async function getLugaresRadicacionByName(req: Request, res: Response, next: NextFunction){
    try {
        const { name } = req.body;


        const lugaresRadicacion = await LugarRadicacion.createQueryBuilder("lugar_radicacion")
        .where("lugar_radicacion.name LIKE :name", { name: `%${name}%` })
        .getMany();

        if (!lugaresRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
            
        }

        return res.json(lugaresRadicacion);
    } catch (error) {
        next(error);
    }
}

// actualizar el estadod de lugar radicacion

export async function updateStatusLugarRadicacion(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { status, name } = req.body;

        const lugarRadicacion = await LugarRadicacion.findOneBy({ id: parseInt(id) });

        if (!lugarRadicacion) {
            return res.status(404).json({ message: "LugarRadicacion not found" });
        }

        if (name) {
            lugarRadicacion.name = name;
        }

        if (status !== undefined && status !== "") {
            lugarRadicacion.status = status == "1";
        }

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
        next(error);
    }
}