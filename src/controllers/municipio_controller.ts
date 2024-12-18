import { NextFunction, Request, Response } from "express";
import { Municipio } from "../entities/municipio";
import { Validate, validate } from "class-validator";

export async function getAllMunicipios(req: Request, res: Response, next: NextFunction) {
    try {
        
        const municipios = await Municipio.find();
        return res.json(municipios);

    } catch (error) {
        next(error);
    }
}

export async function getMunicipioById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const municipio = await Municipio.findOneBy({ id: parseInt(id) });

        if (!municipio) {
            return res.status(404).json({ message: "Municipio not found" });
        }

        return res.json(municipio);

    } catch (error) {
        next(error);
    }
}

export async function createMunicipio(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({ message: "Name and nitMunicipio are required" });
        }

        const municipioExist = await Municipio.findOneBy({ name });

        if (municipioExist) {
            return res.status(400).json({ message: "Municipio already exists" });
        }

        const municipio = new Municipio();
        municipio.name = name;
        municipio.status = true;
        municipio.municipioCode = code;

        const errors = await validate(municipio);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error creating municipio", messages });

        }

        await municipio.save();

        return res.json(municipio);

    } catch (error) {
        next(error);
    }
}

export async function updateMunicipio(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { name, code, status } = req.body;

        const municipio = await Municipio.findOneBy({ id: parseInt(id) });

        if (!municipio) {
            return res.status(404).json({ message: "Municipio not found" });
        }

        municipio.name = name;
        municipio.municipioCode = code;
        municipio.status = status;

        const errors = await validate(municipio);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating municipio", messages });
        }

        await municipio.save();

        return res.json(municipio);

    } catch (error) {
        next(error);
    }
}

export async function deleteMunicipio(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const municipio = await Municipio.findOneBy({ id: parseInt(id) });

        if (!municipio) {
            return res.status(404).json({ message: "Municipio not found" });
        }

        await municipio.remove();

        return res.json({ message: "Municipio deleted" });

    } catch (error) {
        next(error);
    }
}

export async function updateStatusMunicipio(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { status } = req.body;

        const municipio = await Municipio.findOneBy({ id: parseInt(id) });

        if (!municipio) {
            return res.status(404).json({ message: "Municipio not found" });
        }

        municipio.status = status == "1";

        const errors = await validate(municipio);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating status municipio", messages });
        }

        await municipio.save();

        return res.json(municipio);

    } catch (error) {
        next(error);
    }
}