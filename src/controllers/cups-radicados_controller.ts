import { Request, Response } from "express";
import { CupsRadicados } from "../entities/cups-radicados";
import { validate } from "class-validator";

export async function getAllCupsRadicados(req: Request, res: Response){
    try {
        
        const cupsRadicados = await CupsRadicados.find();
        return res.json(cupsRadicados);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export async function getCupsRadicados(req: Request, res: Response){
    try {
        
        const { id } = req.params;
        const cupsId = parseInt(id);

        if (isNaN(cupsId)) {
            return res.status(400).json({ message: "ID must be a number" });
        }

        const cupsRadicados = await CupsRadicados.findOneBy({ id: parseInt(id) });

        if (!cupsRadicados) {
            return res.status(404).json({ message: "Cups Radicados not found" });
        }

        return res.json(cupsRadicados);

    } catch (error) {

        console.error(error);

        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export async function createCupsRadicados(req: Request, res: Response){

    try {
        
        const { code, DescriptionCode, status, observation, functionalUnit, idRadicacion } = req.body;

        if (!code || !DescriptionCode || !status || !observation || !functionalUnit || !idRadicacion) {
            return res.status(400).json({ message: "All fields are required" });
        }


        

        const cupsRadicados = CupsRadicados.create({
            code,
            DescriptionCode,
            status,
            observation,
            functionalUnit,
            idRadicacion
        });

        const errors = await validate(cupsRadicados);

        if (errors.length > 0) {

            const errorMensage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ "mensaje": "Error creating cup", errorMensage });
        }

        await cupsRadicados.save();

        return res.status(201).json(cupsRadicados);

    } catch (error) {
    
            console.error(error);
    
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
    
            return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateCupsRadicados(req: Request, res: Response) {
    
    try {
        
        const { id } = req.params;
        const { code, DescriptionCode, status, observation, functionalUnit, idRadicacion } = req.body;

        if (!code || !DescriptionCode || !status || !observation || !functionalUnit || !idRadicacion) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const cupsId = parseInt(id);

        if (isNaN(cupsId)) {
            return res.status(400).json({ message: "ID must be a number" });
        }

        const cupsRadicados = await CupsRadicados.findOneBy({ id: parseInt(id) });

        if (!cupsRadicados) {
            return res.status(404).json({ message: "Cups Radicados not found" });
        }

        cupsRadicados.code = code;
        cupsRadicados.DescriptionCode = DescriptionCode;
        cupsRadicados.status = status;
        cupsRadicados.observation = observation;
        cupsRadicados.functionalUnit = functionalUnit;

        const errors = await validate(cupsRadicados);

        if (errors.length > 0) {
            const errorMensage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({ message: "Error updating cups", errorMensage });
        }

        await cupsRadicados.save();

        return res.json(cupsRadicados);

    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
        
    }

}

export async function deleteCupsRadicados(req: Request, res: Response) {
    try {
        
        const { id } = req.params;
        const cupsId = parseInt(id);

        if (isNaN(cupsId)) {
            return res.status(400).json({ message: "ID must be a number" });
        }

        const cupsRadicados = await CupsRadicados.findOneBy({ id: parseInt(id) });

        if (!cupsRadicados) {
            return res.status(404).json({ message: "Cups Radicados not found" });
        }

        await cupsRadicados.remove();

        return res.json({ message: "Cups Radicados deleted" });

    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
    }
}